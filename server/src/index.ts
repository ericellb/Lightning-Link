import dotenv from 'dotenv';
import LoadBalancer from './loadbalancer';
import ApiServer from './apiserver';

// Config for env variables
dotenv.config();

// Create our load balancer
new LoadBalancer(process.env.LOAD_BALANCE_PORT as string);

// Create some of our api servers
new ApiServer(process.env.SERVER1_PORT as string);
new ApiServer(process.env.SERVER2_PORT as string);
