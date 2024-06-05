import { defineComponent, provide } from 'vue';

import ProductService from './product/product.service';
import ProductCategoryService from './product-category/product-category.service';
import CustomerDetailsService from './customer-details/customer-details.service';
import ShoppingCartService from './shopping-cart/shopping-cart.service';
import ProductOrderService from './product-order/product-order.service';
import UserService from '@/entities/user/user.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Entities',
  setup() {
    provide('userService', () => new UserService());
    provide('productService', () => new ProductService());
    provide('productCategoryService', () => new ProductCategoryService());
    provide('customerDetailsService', () => new CustomerDetailsService());
    provide('shoppingCartService', () => new ShoppingCartService());
    provide('productOrderService', () => new ProductOrderService());
    // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
  },
});
