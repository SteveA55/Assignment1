// src/users/usersController.ts

import {
    // Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,

} from "tsoa";

import { User } from "../users/user";
import { UsersService } from "../users/usersService";
import { type ParameterizedContext, type DefaultContext, type Request as KoaRequest } from 'koa'

export type BookID = string;

@Route("users")

export class UsersController extends Controller {

    @Get("{userId}")

    public async getUser(
        @Path() userId: number,
        @Query() name?: string
    ): Promise<User> {
        return new UsersService().get(userId, name);
    }

    @SuccessResponse("201", "Created") // Custom success response
    @Post()

    public async createUser(
        //@Body() requestBody: UserCreationParams
    ): Promise<void> {
        this.setStatus(201); // set return status 201
        new UsersService().create(requestBody);
        return;
    }

    @Get("{bookId}")

    public async getBookById(
        @Path() bookId: number,
        @Query() name?: string
    ): Promise<User> {
        return new UsersService().get(bookId, name);
    }
}


@Route('warehouse')

export class WarehouseRoutes extends Controller {

    @Get('{book}')

    public async getBookInfo(

        @Path() book: BookID,

        @Request() request: KoaRequest

    ): Promise<Record<string, number>> {

        const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx

        const data = ctx.state.warehouse

        return data;
    }
}
