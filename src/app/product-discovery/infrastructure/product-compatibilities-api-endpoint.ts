import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ProductCompatibility } from '../domain/model/product-compatibility.entity';
import {
  ProductCompatibilityResource,
  ProductCompatibilitiesResponse,
} from './product-compatibility.response';
import { ProductCompatibilityAssembler } from './product-compatibility.assembler';
import { environment } from '../../../environments/environment';

/**
 * Endpoint client for product compatibility CRUD operations.
 */
export class ProductCompatibilitiesApiEndpoint extends BaseApiEndpoint<
  ProductCompatibility,
  ProductCompatibilityResource,
  ProductCompatibilitiesResponse,
  ProductCompatibilityAssembler
> {
  /**
   * Creates an instance of ProductCompatibilitiesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBasePath}${environment.productCompatibilitiesEndpointPath}`,
      new ProductCompatibilityAssembler(),
    );
  }
}
