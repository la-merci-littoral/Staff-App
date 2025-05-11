import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

const envPath = process.env.NODE_ENV === 'production' ? '../.env.production' : '../.env.development';
require('dotenv').config({ path: envPath });