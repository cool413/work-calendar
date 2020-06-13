<template>
  <form>
    <v-container>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="confirmationId"
            label="確認書號"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field v-model="programId" label="程式代號"></v-text-field>
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
import Calendar from "./calendar";

const jobStatusItem = [
  { text: "", value: "" },
  { text: "new", value: jobStatus.new },
  { text: "processing", value: jobStatus.processing },
  { text: "done", value: jobStatus.done },
  { text: "cancel", value: jobStatus.cancel }
];

const jobPriorityItem = [
  { text: "", value: "" },
  { text: "高", value: jobPriority.heigh },
  { text: "中", value: jobPriority.medium },
  { text: "低", value: jobPriority.low }
];

const today = new Date().toISOString().substr(0, 10);

export default {
  components: {
    Calendar
  },
  mixins: [validationMixin],
  validations: {},
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

    jobStatus: jobStatusItem,
    jobPriority: jobPriorityItem,
    startDateMenu: false,
    endDateMenu: false
  }),

  computed: {},

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
      this.endPickerDate = today;
      this.stratDateFormatted = todayFormatted;
      this.endDateFormatted = todayFormatted;
    }
  }
};
</script>
