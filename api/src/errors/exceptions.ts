import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends HttpException {
    constructor(errors: ValidationError[]) {
        super(
            errors.map((err) => {
                return {
                    property: err.property,
                    reasons: transformReasons(err.constraints),
                };
            }),
            HttpStatus.BAD_REQUEST,
        );
    }
}

function transformReasons(constraints: { [type: string]: string }): string[] {
    let result: string[] = [];

    for (let [key, value] of Object.entries(constraints)) {
        if (key === 'isDefined') {
            return ['Property is missing.'];
        }
        if (value.length > 0) {
            result.push(value);
        } else {
            result.push(`Rule '${key}' is violated.`);
        }
    }

    return result;
}
