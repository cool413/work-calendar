<template>
  <v-app>
    <v-app-bar app color="primary" dark style="display:"></v-app-bar>
    <v-content>
      <v-container fluid>
        <div>
          <v-tabs class="tabs" centered grow height="60px" v-model="activeTab">
            <v-tab v-for="tab in tabs" :key="tab.id" :to="tab.route" exact>{{
              tab.name
            }}</v-tab>
          </v-tabs>
          <router-view></router-view>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  //props: ["id"],

  data: () => ({
    activeTab: `/addTask`,
    tabs: [
      { id: 1, name: "新增工作", route: "/addTask" },
      { id: 2, name: "查詢工作", route: "/About" }
    ]
  }),
  methods: {
    resolvePath(obj) {
      return this.$router.resolve(obj).href;
    },
    updateRoute(route) {
      this.$router.push(route);
    }
  }
};
</script>
