/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';

import ProductOrder from './product-order.vue';
import ProductOrderService from './product-order.service';
import AlertService from '@/shared/alert/alert.service';

type ProductOrderComponentType = InstanceType<typeof ProductOrder>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('ProductOrder Management Component', () => {
    let productOrderServiceStub: SinonStubbedInstance<ProductOrderService>;
    let mountOptions: MountingOptions<ProductOrderComponentType>['global'];

    beforeEach(() => {
      productOrderServiceStub = sinon.createStubInstance<ProductOrderService>(ProductOrderService);
      productOrderServiceStub.retrieve.resolves({ headers: {} });

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          bModal: bModalStub as any,
          'font-awesome-icon': true,
          'b-badge': true,
          'b-button': true,
          'router-link': true,
        },
        directives: {
          'b-modal': {},
        },
        provide: {
          alertService,
          productOrderService: () => productOrderServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        productOrderServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(ProductOrder, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(productOrderServiceStub.retrieve.calledOnce).toBeTruthy();
        expect(comp.productOrders[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: ProductOrderComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(ProductOrder, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        productOrderServiceStub.retrieve.reset();
        productOrderServiceStub.retrieve.resolves({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        productOrderServiceStub.delete.resolves({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeProductOrder();
        await comp.$nextTick(); // clear components

        // THEN
        expect(productOrderServiceStub.delete.called).toBeTruthy();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(productOrderServiceStub.retrieve.callCount).toEqual(1);
      });
    });
  });
});
