"use strict";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  maxRetries: 3,
  httpOptions: {
    timeout: 5000,
  },
});
const documentClient = DynamoDBDocumentClient.from(client);
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

export const createNote = async (event, context) => {
  // Optimization for lambda to not wait for Node.js event queue to finished
  // Rather, function can send the response back directly
  context.callbackWaitsForEmptyEventLoop = false;

  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: "attribute_not_exists(notesId)",
    };

    await documentClient.send(new PutCommand(params));

    return send(201, data);
  } catch (error) {
    return send(500, error.message);
  }
};

export const updateNote = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let notesId = event.pathParameters.id;
  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      UpdateExpression: "set #title = :title, #body = :body",
      ExpressionAttributeNames: {
        "#title": "title",
        "#body": "body",
      },
      ExpressionAttributeValues: {
        ":title": data.title,
        ":body": data.body,
      },
      ConditionExpression: "attribute_exists(notesId)",
    };

    await documentClient.send(new UpdateCommand(params));
    return send(200, data);
  } catch (error) {
    return send(500, error.message);
  }
};

export const deleteNote = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let notesId = event.pathParameters.id;

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      ConditionExpression: "attribute_exists(notesId)",
    };

    await documentClient.send(new DeleteCommand(params));
    return send(200, notesId);
  } catch (error) {
    return send(500, error.message);
  }
};

export const getAllNotes = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    };

    const notes = await documentClient.send(new ScanCommand(params));
    return send(200, notes.Items);
  } catch (error) {
    return send(500, error.message);
  }
};
