/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import CustomerDetailsUpdate from './customer-details-update.vue';
import CustomerDetailsService from './customer-details.service';
import AlertService from '@/shared/alert/alert.service';

import UserService from '@/entities/user/user.service';

type CustomerDetailsUpdateComponentType = InstanceType<typeof CustomerDetailsUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const customerDetailsSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<CustomerDetailsUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('CustomerDetails Management Update Component', () => {
    let comp: CustomerDetailsUpdateComponentType;
    let customerDetailsServiceStub: SinonStubbedInstance<CustomerDetailsService>;

    beforeEach(() => {
      route = {};
      customerDetailsServiceStub = sinon.createStubInstance<CustomerDetailsService>(CustomerDetailsService);
      customerDetailsServiceStub.retrieve.onFirstCall().resolves(Promise.resolve([]));

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
          customerDetailsService: () => customerDetailsServiceStub,

          userService: () =>
            sinon.createStubInstance<UserService>(UserService, {
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
        const wrapper = shallowMount(CustomerDetailsUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.customerDetails = customerDetailsSample;
        customerDetailsServiceStub.update.resolves(customerDetailsSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(customerDetailsServiceStub.update.calledWith(customerDetailsSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        customerDetailsServiceStub.create.resolves(entity);
        const wrapper = shallowMount(CustomerDetailsUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.customerDetails = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(customerDetailsServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        customerDetailsServiceStub.find.resolves(customerDetailsSample);
        customerDetailsServiceStub.retrieve.resolves([customerDetailsSample]);

        // WHEN
        route = {
          params: {
            customerDetailsId: '' + customerDetailsSample.id,
          },
        };
        const wrapper = shallowMount(CustomerDetailsUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.customerDetails).toMatchObject(customerDetailsSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        customerDetailsServiceStub.find.resolves(customerDetailsSample);
        const wrapper = shallowMount(CustomerDetailsUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
