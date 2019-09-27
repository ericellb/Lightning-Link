import dotenv from 'dotenv';
import LoadBalancer from './loadbalancer';
import ApiServer from './apiserver';
import CounterServer from './counterserver';

// Declare the ENV vars we plan to use some intellisense + types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      ROOT_URL: string;
      API1_PORT: string;
      API2_PORT: string;
      LOAD_BALANCE_PORT: string;
      COUNTER_PORT: string;
      GEO_API_KEY: string;
    }
  }
}

// Config for env variables
dotenv.config();

const rootURL = process.env.ROOT_URL;
const API1_PORT = process.env.API1_PORT;
const API2_PORT = process.env.API2_PORT;
const LOAD_BALANCE_PORT = process.env.LOAD_BALANCE_PORT;
const COUNTER_PORT = process.env.COUNTER_PORT;
const COUNTER_URL = `${rootURL}:${COUNTER_PORT}`;

// List of servers we plan to boot to pass to load balancer
const servers = [`${rootURL}:${API1_PORT}`, `${rootURL}:${API2_PORT}`];

// Make sure all our env vars set properly
if (API1_PORT && API2_PORT && LOAD_BALANCE_PORT && COUNTER_PORT) {
  // Create our load balancer
  new LoadBalancer(LOAD_BALANCE_PORT, servers);

  // Create our counter server
  new CounterServer(COUNTER_PORT);

  // Create some of our api servers
  new ApiServer(COUNTER_URL, API1_PORT);
  new ApiServer(COUNTER_URL, API2_PORT);
}
