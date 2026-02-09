'use strict';

import express, { request, response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';

import fieldsRoutes from '../src/fields/field.routes.js';

const BASE_PATH = '/kinalSportsAdmin/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(express.json({ limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));
}

const routes = (app) => {

    app.use(`${BASE_PATH}/fields`, fieldsRoutes);
    app.get(`${BASE_PATH}/health`, (req, res) => {
        response.status(200).json({
            status: 'Haelthy',
            timestamp: new Date().toISOString(),
            service: 'KinalSports Admin Server'
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado en Admin API'
        })
    })
}

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trus proxy', 1);

    try {
        await dbConnection();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {
            console.log('KinalSports Admin Server running on port ${PORT}');
            console.log('Health check: http://localhost:${PORT}${BASE_PATH}/health');
        })
    } catch (error) {
        console.error('Error starting Admin Server: ${error.message}');
        process.exit(1);
    }
}

export const getFields = async (req, res) => {
    try {
        
        const { page = 1, limit = 10, isActive = true } = req.query;

        const filter = { isActive };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAd: -1 }
        }

        const fields = await Field.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .short(options.sort);

            const total = await Field.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: fields,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalRecords: total,
                    limit
                }
            })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los campos',
            error: error.message
        })
    }
}