import * as AWS from 'aws-sdk';

import { CustomerAccountDto } from '@dto/customer-account';
import { config } from '@config/config';
import { logger } from '@packages/logger';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function createAccount(
  customerAccount: CustomerAccountDto
): Promise<CustomerAccountDto> {
  const tableName = config.get('tableName');

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: customerAccount,
  };

  await dynamoDb.put(params).promise();
  logger.info(`Customer account ${customerAccount.id} stored in ${tableName}`);

  return customerAccount;
}

export async function updateAccount(
  customerAccount: CustomerAccountDto
): Promise<CustomerAccountDto> {
  const tableName = config.get('tableName');

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: customerAccount,
  };

  await dynamoDb.put(params).promise();
  logger.info(`Customer account ${customerAccount.id} updated in ${tableName}`);

  return customerAccount;
}

export async function retrieveAccount(id: string): Promise<CustomerAccountDto> {
  const tableName = config.get('tableName');

  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: tableName,
    Key: {
      id,
    },
  };

  const { Item: item } = await dynamoDb.get(params).promise();

  const customer: CustomerAccountDto = {
    ...(item as CustomerAccountDto),
  };

  logger.info(`Customer account ${customer.id} retrieved from ${tableName}`);

  return customer;
}
