import { registerEnumType } from "@nestjs/graphql";

export enum RESOURCES {
  USERS = 'USERS',
  ROLES = 'ROLES',
  PERMISSIONS = 'PERMISSIONS',
  PRODUCTS = 'PRODUCTS',
  CATEGORIES = 'CATEGORIES',
  TAGS = 'TAGS',
  ORDERS = 'ORDERS',
}

registerEnumType(RESOURCES, { 
  name: 'RESOURCES',
  description: 'Enum for resources that can be managed in the application',
});