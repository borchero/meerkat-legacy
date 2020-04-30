import { Catch, HttpException, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply } from 'fastify';
import { OutgoingMessage } from 'http';
import { ValidationException } from './exceptions';

interface INestException {
    message: string;
}

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost) {
        console.log('validation');
        const context = host.switchToHttp();
        const response = context.getResponse<FastifyReply<OutgoingMessage>>();

        response.code(exception.getStatus()).send({
            message: 'Validation of client parameters failed.',
            errors: exception.getResponse(),
        });
    }
}

@Catch()
export class GenericExceptionFilter extends BaseExceptionFilter {
    catch(exc: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<FastifyReply<OutgoingMessage>>();

        if (exc instanceof HttpException) {
            const exception = exc as HttpException;

            // We only catch string error messages, otherwise, we simply pass on the exception to be
            // handled by some more generic filter.
            const resp = exception.getResponse();
            if (typeof resp === 'string') {
                response.code(exception.getStatus()).send({
                    message: resp,
                });
                return;
            }

            const msg = resp as INestException;
            if (msg.message) {
                response.code(exception.getStatus()).send({
                    message: msg.message,
                });
                return;
            }
        }

        console.log('+++ UNKNOWN ERROR +++');
        console.log(exc);

        response.code(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: 'Unknown server error',
        });
    }
}
