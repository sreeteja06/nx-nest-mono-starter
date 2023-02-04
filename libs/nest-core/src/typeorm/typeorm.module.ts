import { DynamicModule, Module } from '@nestjs/common';
import {
  DataSource,
  DataSourceOptions,
  EntitySchema,
  MixedList,
} from 'typeorm';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import TypeormLogger from './typeorm.logger';
import { ConfigModule } from '../config/config.module';
import { IConfigService } from '../config/config.adapter';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({})
export class TypeOrmModule {
  static forRoot(options: {
    appName: string;
    type: DataSourceOptions['type'];
    entities: MixedList<string | EntitySchema<any>>;
    maxQueryExecutionTime?: number; // 1000ms
  }): DynamicModule {
    return {
      module: TypeOrmModule,
      imports: [
        NestTypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: IConfigService) => ({
            appname: options.appName,
            type: <any>options.type,
            host: configService.TYPEORM?.HOST,
            port: configService.TYPEORM?.PORT,
            username: configService.TYPEORM?.USER,
            password: configService.TYPEORM?.PASS,
            database: configService.TYPEORM?.DATABASE,
            entities: options.entities,
            // Logs slow queries (queries that take more than 1 second)
            maxQueryExecutionTime: options.maxQueryExecutionTime || 1000,
            logger: new TypeormLogger(configService.TYPEORM?.LOGGING),
          }),
          inject: [IConfigService],
        }),
      ],
      providers: [],
      exports: [],
    };
  }

  static forFeature(
    entities?: EntityClassOrSchema[],
    dataSource?: DataSource | DataSourceOptions | string
  ): DynamicModule {
    return NestTypeOrmModule.forFeature(entities, dataSource);
  }
}
