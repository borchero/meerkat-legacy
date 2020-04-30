import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { GenericExceptionFilter, ValidationFilter } from './errors/filters';
import { ValidationException } from './errors/exceptions';

async function main() {
    // Create factory
    const adapter = new FastifyAdapter({ logger: true });
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

    // Set custom exception handling
    const { httpAdapter } = app.get(HttpAdapterHost);
    const rootFilter = new GenericExceptionFilter(httpAdapter);
    const validationFilter = new ValidationFilter();
    app.useGlobalFilters(rootFilter, validationFilter);

    // Add pipes
    const validationPipe = new ValidationPipe({
        dismissDefaultMessages: true,
        exceptionFactory: (errors) => new ValidationException(errors),
    });
    app.useGlobalPipes(validationPipe);

    // Start server
    await app.listen(3000, '0.0.0.0', (error) => {
        if (error != null) {
            console.log(`Failed to listen on port 3000 on all interfaces: ${error}`);
        }
    });
}

main();
