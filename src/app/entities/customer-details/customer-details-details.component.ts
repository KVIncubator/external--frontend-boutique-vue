import { defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import CustomerDetailsService from './customer-details.service';
import { type ICustomerDetails } from '@/shared/model/customer-details.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'CustomerDetailsDetails',
  setup() {
    const customerDetailsService = inject('customerDetailsService', () => new CustomerDetailsService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const customerDetails: Ref<ICustomerDetails> = ref({});

    const retrieveCustomerDetails = async customerDetailsId => {
      try {
        const res = await customerDetailsService().find(customerDetailsId);
        customerDetails.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.customerDetailsId) {
      retrieveCustomerDetails(route.params.customerDetailsId);
    }

    return {
      alertService,
      customerDetails,

      previousState,
      t$: useI18n().t,
    };
  },
});
