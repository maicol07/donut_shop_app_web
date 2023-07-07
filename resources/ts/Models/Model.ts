import {Model as BaseModel, PaginationStrategy, PluralResponse} from 'coloquent';
import type {Class, Constructor, ValueOf} from 'type-fest';

import RequestHttpClient from '~/Models/Http/RequestHttpClient';
import {Resource} from 'coloquent/dist/Resource';
import {ToOneRelation} from 'coloquent/dist/relation/ToOneRelation';
import {ToManyRelation} from 'coloquent/dist/relation/ToManyRelation';
import dayjs from 'dayjs';

export interface ModelAttributes {
  createdAt: Date;
  updatedAt: Date;

  [key: string]: unknown;
}

export interface ModelRelations extends Record<string, Model<any, any> | Model<any, any>[]>{
}

export interface ModelPivots extends Record<string, unknown> {
}

// noinspection JSDuplicatedDeclaration
/**
 * The base model for all models.
 */
export default abstract class Model<A extends ModelAttributes, R extends ModelRelations = ModelRelations, P extends ModelPivots = ModelPivots> extends BaseModel {
  protected static pageSize: number = 1_000_000;
  protected static paginationStrategy = PaginationStrategy.PageBased;
  protected static jsonApiBaseUrl = '/api';
  protected static httpClient = new RequestHttpClient();
  protected pivots: P = {} as P;
  protected resource: Resource & {relationships: R} | undefined = undefined;

  abstract attributesNames: (keyof A)[];
  __relationsNames!: (keyof R)[];

  static dates: Record<string, string> = {
    createdAt: 'YYYY-MM-DDTHH:mm:ss.ssssssZ',
    updatedAt: 'YYYY-MM-DDTHH:mm:ss.ssssssZ'
  };


  protected static get jsonApiType() {
    return `${this.name.toLowerCase()}s`;
  }

  /**
   * Returns all the instances of the model. (Alias of {@link Model.get}).
   */
  // @ts-ignore
  static all<M extends Model<any, any>>(this: Constructor<M>): Promise<PluralResponse<M>> {
    // @ts-expect-error
    return this.get();
  }

  /**
   * Set multiple attributes on the model.
   */
  setAttributes(attributes: A | Map<keyof A, ValueOf<A>>) {
    // Record to map
    if (!(attributes instanceof Map)) {
      // eslint-disable-next-line no-param-reassign
      attributes = new Map(Object.entries(attributes) as [keyof A, ValueOf<A>][]);
    }

    for (const [attribute, value] of attributes) {
      this.setAttribute(attribute, value);
    }
  }

  getAttribute<AN extends keyof A = keyof A>(attributeName: AN) {
    return super.getAttribute(attributeName as string) as ValueOf<A, AN>;
  }

  getAttributes() {
    return super.getAttributes() as A;
  }

  setAttribute<AN extends keyof A = keyof A>(attributeName: AN, value: ValueOf<A, AN>) {
    // @ts-expect-error
    if (this.isDateAttribute(attributeName)) {
      // @ts-expect-error
      const date = dayjs(value);
      if (date.isValid()) {
        // @ts-expect-error
        value = date.format((this as Model<any>).constructor.dates[attributeName]);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // @ts-expect-error
    this.attributes.set(attributeName as string, value);
  }

  getRelations(): R {
    return super.getRelations() as R;
  }

  getRelation<RN extends keyof R = keyof R>(relationName: RN) {
    return super.getRelation(relationName as string) as ValueOf<R, RN> | undefined;
  }

  setRelation<RN extends keyof R = keyof R>(relationName: RN, value: ValueOf<R, RN> | undefined) {
    // Set related model pivots
    const rel = this.resource?.relationships?.[relationName]?.data;
    if (rel !== undefined) {
      if (value instanceof Model && Object.keys(value.getPivots()).length === 0) {
        let pivots = {};
        if (Array.isArray(rel)) {
          pivots = rel.find((r) => r.id === value.getId())?.pivots ?? {};
        } else {
          pivots = rel.pivots ?? {};
        }
        value.setPivots(pivots);
      } else if (Array.isArray(value)) {
        for (const relatedModel of value) {
          if (Object.keys(relatedModel.getPivots()).length === 0) {
            let pivots = {};
            if (Array.isArray(rel)) {
              pivots = rel.find((r) => r.id === relatedModel.getId())?.pivots ?? {};
            } else {
              pivots = rel.pivots ?? {};
            }
            relatedModel.setPivots(pivots);
          }
        }
      }
    }

    super.setRelation(relationName as string, value);
  }

  getPivots() {
    return this.pivots;
  }

  setPivots(pivots: P) {
    this.pivots = pivots;
  }

  getPivot<PN extends keyof P = keyof P>(key: PN): ValueOf<P, PN> {
    return this.pivots[key];
  }

  setPivot<PN extends keyof P = keyof P>(key: PN, value: ValueOf<P, PN>) {
    this.pivots[key] = value;
  }

  private serializeRelatedModel(model: Model<any, any>) {
    // @ts-expect-error - `serializeRelatedModel` is private in coloquent
    const data: {type: string, id: string, pivots?: Record<string, unknown>} = super.serializeRelatedModel(model);
    data.pivots = model.getPivots();
    return data;
  }

  populateFromResource(resource: Resource & {relationships: R, pivots?: P}) {
    super.populateFromResource(resource);
    this.resource = resource;
  }

  /**
   * Get model ID.
   */
  getId() {
    return this.getApiId();
  }

  /**
   * Check if the model is new (not already saved).
   */
  isNew() {
    return this.getId() === undefined;
  }

  // @ts-ignore

  protected hasOne<R extends Model<any>>(relatedType: Class<R>): ToOneRelation<R, this> {
    // @ts-ignore
    return super.hasOne(relatedType) as ToOneRelation<R, this>;
  }
  // @ts-ignore
  protected hasOne<R extends Model<any>>(relatedType: Class<R>, relationName: string): ToOneRelation<R, this>{
    // @ts-ignore
    return super.hasOne(relatedType, relationName) as ToOneRelation<R, this>;
  }

  // @ts-ignore
  protected hasMany<R extends Model<any>>(relatedType: Class<R>): ToManyRelation<R, this> {
    // @ts-ignore
    return super.hasMany(relatedType) as ToManyRelation<R, this>;
  }

  // @ts-ignore
  protected hasMany<R extends Model<any>>(relatedType: Class<R>, relationName: string): ToManyRelation<R, this> {
    // @ts-ignore
    return super.hasMany(relatedType, relationName) as ToManyRelation<R, this>;
  }

  protected getAttributeAsDate(attributeName: string) {
    // @ts-ignore
    let attr = this.attributes.get(attributeName);
    if (attr && dayjs(attr).isValid()) {
      attr = super.getAttributeAsDate(attributeName);
    }
    return attr;
  }
}
