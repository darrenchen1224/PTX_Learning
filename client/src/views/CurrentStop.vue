<template>
  <div class="container background">
    <div class="row">
      <div class="col">
        <h3 class="text">客運到站查詢</h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input type="text" v-model="busName" placeholder="請輸入客運路線" />
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <input type="text" v-model="dircrtion" placeholder="請輸入方向(去程:0 往程:1)" />
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <button class="button" v-on:click="reset()">清除</button>
        <button class="button" v-on:click="getStopinfo(busName, dircrtion)">搜尋</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <br />
        <button
          class="button2"
          v-for="item in stopInfo"
          :key="item.StopName"
          v-on:click="choseStop(item.StopName, item.StopSequence)"
        >
          {{ item.StopName }}
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <br />
        <h5 class="text" v-for="item in busInfo" :key="item.PlateNumb">
          {{ item.PlateNumb }} 距離{{ choseStopName }}還有{{ item.StopSequence }}站
        </h5>
        <h5 class="text" v-if="nonbus">目前無行駛中車輛</h5>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CurrentStop',
  data() {
    return {
      choseStopName: null,
      busInfo: null,
      stopInfo: null,
      busName: null,
      dircrtion: null,
      nonbus: false,
    };
  },

  sockets: {
    getbusInfo(data) {
      this.busInfo = data; //有行駛車輛
      this.nonbus = false;
      if (this.busInfo == '') {
        this.nonbus = true;
      } //無行駛車輛
    },
  },

  methods: {
    getStopinfo(busName, dircrtion) {
      this.nonbus = false;
      axios
        .get(`http://localhost:3000/api/getStopinfo/${busName}/${dircrtion}`)
        .then((res) => {
          this.stopInfo = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }, //取的站牌名稱
    choseStop(StopName, StopSequence) {
      this.$socket.emit('sendstopname', StopSequence);
      this.choseStopName = StopName;
    }, //選擇站牌
    reset() {
      this.stopInfo = null;
      this.busInfo = null;
      this.choseStopName = null;
      this.busName = null;
      this.dircrtion = null;
      this.nonbus = false;
    }, //重置
  },
};
</script>

<style>
.background {
  background: black;
  width: 1000px;
  height: 400px;
}

.button {
  background: #e0e0e0;
  color: black;
}

.button2 {
  background: #008cba;
  color: white;
  margin-right: 1px;
}

.text {
  font-weight: bold;
}
</style>
