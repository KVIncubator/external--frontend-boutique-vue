/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';

import ShoppingCart from './shopping-cart.vue';
import ShoppingCartService from './shopping-cart.service';
import AlertService from '@/shared/alert/alert.service';

type ShoppingCartComponentType = InstanceType<typeof ShoppingCart>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('ShoppingCart Management Component', () => {
    let shoppingCartServiceStub: SinonStubbedInstance<ShoppingCartService>;
    let mountOptions: MountingOptions<ShoppingCartComponentType>['global'];

    beforeEach(() => {
      shoppingCartServiceStub = sinon.createStubInstance<ShoppingCartService>(ShoppingCartService);
      shoppingCartServiceStub.retrieve.resolves({ headers: {} });

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
          shoppingCartService: () => shoppingCartServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        shoppingCartServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(ShoppingCart, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(shoppingCartServiceStub.retrieve.calledOnce).toBeTruthy();
        expect(comp.shoppingCarts[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: ShoppingCartComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(ShoppingCart, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        shoppingCartServiceStub.retrieve.reset();
        shoppingCartServiceStub.retrieve.resolves({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        shoppingCartServiceStub.delete.resolves({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeShoppingCart();
        await comp.$nextTick(); // clear components

        // THEN
        expect(shoppingCartServiceStub.delete.called).toBeTruthy();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(shoppingCartServiceStub.retrieve.callCount).toEqual(1);
      });
    });
  });
});
