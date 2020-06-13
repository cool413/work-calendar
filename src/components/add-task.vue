<template>
  <form>
    <v-container>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="confirmationId"
            label="確認書號"
            :error-messages="confirmationIdErrors"
            @input="$v.confirmationId.$touch()"
            @blur="$v.confirmationId.$touch()"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="programId"
            label="程式代號"
            :error-messages="programIdErrors"
            @input="$v.programId.$touch()"
            @blur="$v.programId.$touch()"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field v-model="tagId" label="標籤"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-select
            v-model="jobPrioritySelect"
            :items="jobPriority"
            item-text="text"
            item-value="value"
            label="優先度"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            v-model="jobStatusSelect"
            :items="jobStatus"
            item-text="text"
            item-value="value"
            label="狀態"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-menu
            ref="startDateMenu"
            v-model="startDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="stratDateFormatted"
                label="開始日期"
                persistent-hint
                prepend-icon="event"
                @blur="startPickerDate = parseDate(stratDateFormatted)"
                v-bind="attrs"
                v-on="on"
                readonly
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startPickerDate"
              no-title
              @input="startDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="2">
          <v-menu
            v-model="endDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDateFormatted"
                label="結束日期"
                persistent-hint
                prepend-icon="event"
                @blur="endPickerDate = parseDate(endDateFormatted)"
                v-bind="attrs"
                v-on="on"
                readonly
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endPickerDate"
              no-title
              @input="endDateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="hours"
            label="程式時數"
            :error-messages="hoursErrors"
            @input="$v.hours.$touch()"
            @blur="$v.hours.$touch()"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="dailyHours"
            label="每日分配時數"
            :error-messages="dailyHoursErrors"
            @input="$v.dailyHours.$touch()"
            @blur="$v.dailyHours.$touch()"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn class="mr-4" @click="submit">submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-container>
    <v-container fluid>
      <Calendar style="width:50% ;height:100%" />
    </v-container>
  </form>
</template>

<script>
import { jobPriority, jobStatus } from "../enums/job-enums";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { regex } from "vuelidate/lib/validators/common";
import Calendar from "./calendar";

const jobStatusItem = [
  { text: "new", value: jobStatus.new },
  { text: "processing", value: jobStatus.processing },
  { text: "done", value: jobStatus.done },
  { text: "cancel", value: jobStatus.cancel }
];

const jobPriorityItem = [
  { text: "high", value: jobPriority.heigh },
  { text: "medium", value: jobPriority.medium },
  { text: "low", value: jobPriority.low }
];

const today = new Date().toISOString().substr(0, 10);
const erroMsg = "格式錯誤";
const hoursRule = regex("one decimal places", /^[0-9]+(\.[0-9])?$/);

export default {
  components: {
    Calendar
  },
  mixins: [validationMixin],
  validations: {
    confirmationId: { required },
    programId: { required },
    hours: { required, hoursRule },
    dailyHours: { required, hoursRule }
  },
  data: vm => ({
    //default value
    confirmationId: "",
    programId: "",
    tagId: "",
    jobPrioritySelect: jobPriorityItem[0],
    jobStatusSelect: jobStatusItem[0],
    startPickerDate: today,
    stratDateFormatted: vm.formatDate(today),
    endPickerDate: today,
    endDateFormatted: vm.formatDate(today),
    hours: 0,
    dailyHours: 0,

    jobStatus: jobStatusItem,
    jobPriority: jobPriorityItem,
    startDateMenu: false,
    endDateMenu: false
  }),

  computed: {
    confirmationIdErrors() {
      const errors = [];
      if (!this.$v.confirmationId.$dirty) return errors;
      !this.$v.confirmationId.required && errors.push("請輸入 確認書號");
      return errors;
    },
    programIdErrors() {
      const errors = [];
      if (!this.$v.programId.$dirty) return errors;
      !this.$v.programId.required && errors.push("請輸入 程式代號");
      return errors;
    },
    hoursErrors() {
      const errors = [];
      if (!this.$v.hours.$dirty) return errors;
      !this.$v.hours.required && errors.push("請輸入 程式時數");
      !this.$v.hours.hoursRule && errors.push(erroMsg);
      return errors;
    },
    dailyHoursErrors() {
      const errors = [];
      if (!this.$v.dailyHours.$dirty) return errors;
      !this.$v.dailyHours.required && errors.push("請輸入 每日分配時數");
      !this.$v.hours.hoursRule && errors.push(erroMsg);
      return errors;
    }
  },

  watch: {
    startPickerDate() {
      this.stratDateFormatted = this.formatDate(this.startPickerDate);
    },
    endPickerDate() {
      if (this.endPickerDate < this.startPickerDate) {
        this.startPickerDate = this.endPickerDate;
      }
      this.endDateFormatted = this.formatDate(this.endPickerDate);
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}/${month}/${day}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    submit() {
      this.$v.$touch();
    },
    clear() {
      const todayFormatted = this.formatDate(today);
      this.$v.$reset();
      this.confirmationId = "";
      this.tagId = "";
      this.jobPrioritySelect = jobPriorityItem[0];
      this.jobStatusSelect = jobStatusItem[0];
      this.startPickerDate = today;
      this.stratDateFormatted = todayFormatted;
      this.endPickerDate = today;
      this.endDateFormatted = todayFormatted;
      this.hours = 0;
      this.dailyHours = 0;
    }
  }
};
</script>
