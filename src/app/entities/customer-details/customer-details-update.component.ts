import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import CustomerDetailsService from './customer-details.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import UserService from '@/entities/user/user.service';
import { type ICustomerDetails, CustomerDetails } from '@/shared/model/customer-details.model';
import { Gender } from '@/shared/model/enumerations/gender.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'CustomerDetailsUpdate',
  setup() {
    const customerDetailsService = inject('customerDetailsService', () => new CustomerDetailsService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const customerDetails: Ref<ICustomerDetails> = ref(new CustomerDetails());
    const userService = inject('userService', () => new UserService());
    const users: Ref<Array<any>> = ref([]);
    const genderValues: Ref<string[]> = ref(Object.keys(Gender));
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

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

    const initRelationships = () => {
      userService()
        .retrieve()
        .then(res => {
          users.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      gender: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      phone: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      addressLine1: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      addressLine2: {},
      city: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      country: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      user: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
    };
    const v$ = useVuelidate(validationRules, customerDetails as any);
    v$.value.$validate();

    return {
      customerDetailsService,
      alertService,
      customerDetails,
      previousState,
      genderValues,
      isSaving,
      currentLanguage,
      users,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.customerDetails.id) {
        this.customerDetailsService()
          .update(this.customerDetails)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('boutiqueApp.customerDetails.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.customerDetailsService()
          .create(this.customerDetails)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('boutiqueApp.customerDetails.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
