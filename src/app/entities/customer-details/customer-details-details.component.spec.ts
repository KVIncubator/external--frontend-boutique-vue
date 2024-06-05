/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, type MountingOptions } from '@vue/test-utils';
import sinon, { type SinonStubbedInstance } from 'sinon';
import { type RouteLocation } from 'vue-router';

import CustomerDetailsDetails from './customer-details-details.vue';
import CustomerDetailsService from './customer-details.service';
import AlertService from '@/shared/alert/alert.service';

type CustomerDetailsDetailsComponentType = InstanceType<typeof CustomerDetailsDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const customerDetailsSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('CustomerDetails Management Detail Component', () => {
    let customerDetailsServiceStub: SinonStubbedInstance<CustomerDetailsService>;
    let mountOptions: MountingOptions<CustomerDetailsDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      customerDetailsServiceStub = sinon.createStubInstance<CustomerDetailsService>(CustomerDetailsService);

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'router-link': true,
        },
        provide: {
          alertService,
          customerDetailsService: () => customerDetailsServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        customerDetailsServiceStub.find.resolves(customerDetailsSample);
        route = {
          params: {
            customerDetailsId: '' + 123,
          },
        };
        const wrapper = shallowMount(CustomerDetailsDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.customerDetails).toMatchObject(customerDetailsSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        customerDetailsServiceStub.find.resolves(customerDetailsSample);
        const wrapper = shallowMount(CustomerDetailsDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
