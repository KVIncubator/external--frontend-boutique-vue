/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import ProductOrderUpdate from './product-order-update.vue';
import ProductOrderService from './product-order.service';
import AlertService from '@/shared/alert/alert.service';

import ProductService from '@/entities/product/product.service';
import ShoppingCartService from '@/entities/shopping-cart/shopping-cart.service';

type ProductOrderUpdateComponentType = InstanceType<typeof ProductOrderUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const productOrderSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<ProductOrderUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('ProductOrder Management Update Component', () => {
    let comp: ProductOrderUpdateComponentType;
    let productOrderServiceStub: SinonStubbedInstance<ProductOrderService>;

    beforeEach(() => {
      route = {};
      productOrderServiceStub = sinon.createStubInstance<ProductOrderService>(ProductOrderService);
      productOrderServiceStub.retrieve.onFirstCall().resolves(Promise.resolve([]));

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          productOrderService: () => productOrderServiceStub,
          productService: () =>
            sinon.createStubInstance<ProductService>(ProductService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
          shoppingCartService: () =>
            sinon.createStubInstance<ShoppingCartService>(ShoppingCartService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(ProductOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.productOrder = productOrderSample;
        productOrderServiceStub.update.resolves(productOrderSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(productOrderServiceStub.update.calledWith(productOrderSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        productOrderServiceStub.create.resolves(entity);
        const wrapper = shallowMount(ProductOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.productOrder = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(productOrderServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        productOrderServiceStub.find.resolves(productOrderSample);
        productOrderServiceStub.retrieve.resolves([productOrderSample]);

        // WHEN
        route = {
          params: {
            productOrderId: '' + productOrderSample.id,
          },
        };
        const wrapper = shallowMount(ProductOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.productOrder).toMatchObject(productOrderSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        productOrderServiceStub.find.resolves(productOrderSample);
        const wrapper = shallowMount(ProductOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
