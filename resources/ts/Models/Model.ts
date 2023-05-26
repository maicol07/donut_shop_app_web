import {
  Model as BaseModel,
  PaginationStrategy,
  PluralResponse
} from 'coloquent';
import type {Constructor, ValueOf} from 'type-fest';

import RequestHttpClient from '~/Models/Http/RequestHttpClient';
import {Resource} from 'coloquent/dist/Resource';

export interface ModelAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  [key: string]: unknown;
}

export interface ModelRelations {
  [key: string]: unknown;
}

export interface ModelRelationsPivots extends Record<string, Record<string, unknown>> {
}

/**
 * The base model for all models.
 */
// @ts-expect-error – Necessary for overriding serialize
export default abstract class Model<A extends ModelAttributes, R extends ModelRelations = ModelRelations, RP extends ModelRelationsPivots = ModelRelationsPivots> extends BaseModel {
  protected static paginationStrategy = PaginationStrategy.PageBased;
  protected static jsonApiBaseUrl = '/api';
  protected static httpClient = new RequestHttpClient();
  // @ts-ignore
  private relationsPivots: RP = {};

  abstract attributesNames: (keyof A)[];
  __relations!: (keyof R)[];

  static dates = {
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
    return super.getAttributes() as ModelAttributes;
  }

  setAttribute<AN extends keyof A = keyof A>(attributeName: AN, value: ValueOf<A, AN>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // @ts-expect-error
    this.attributes.set(attributeName as string, value);
  }

  getRelation<RN extends keyof R = keyof R>(relationName: RN) {
    return super.getRelation(relationName as string) as ValueOf<R, RN> | ValueOf<R, RN>[];
  }

  setRelation<RN extends keyof R = keyof R>(relationName: RN, value: ValueOf<R, RN> | ValueOf<R, RN>[]) {
    super.setRelation(relationName as string, value);
  }

  getRelationPivotData<RPN extends keyof RP = keyof RP>(relationName: RPN): ValueOf<RP, RPN> {
    return this.relationsPivots[relationName];
  }

  setRelationPivotData<RPN extends keyof RP = keyof RP>(relationName: RPN, value: ValueOf<RP, RPN>) {
    this.relationsPivots[relationName] = value;
  }

  private serialize() {
    // @ts-expect-error - Serialize is private
    const data: {data: Resource & {attributes: ModelAttributes; relationships: Record<string, {data: { type: string; id: string; attributes: Record<string, unknown>, pivots: Record<string, unknown> }}>}} = super.serialize();
    for (const relationName of Object.keys(this.relationsPivots)) {
      data.data.relationships[relationName].data.pivots = this.relationsPivots[relationName];
    }
    return data;
  }

  populateFromResource(resource: Resource) {
    super.populateFromResource(resource);

    for (const relationName of Object.keys(resource.relationships)) {
      this.setRelationPivotData(relationName, resource.relationships[relationName].data.pivots);
    }
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
}
