<template>
  <div>
    <vue-element-loading :active="show" text="开箱中" element-loading-spinner="el-icon-loading"/>
    <div class="sb_chooseBox none">
      <div class="sb_header">
        <!-- <div class="sb_headerbox">快递柜样机</div> -->
        <div class="sb_headerboxs">
          <img src="../../assets/images/an_iconad.png">
          <p class="sb_headerboxp">洛阳市洛龙区</p>
        </div>
        <div class="sb_reCode">扫码换柜</div>
        <div class="sb_space"></div>
      </div>
      <div class="sb_boxtypeTi">
        <div class="sb_boxtypeTiL">选择箱子类型</div>
        <div class="sb_boxtypeTiR">
          <img class="sb_boxtypeTiR1" src="../../assets/images/sb_icons.png">
          <div class="sb_boxtypeTiR2" @click="openDialog">操作指南</div>
        </div>
      </div>
      <ul id="sb_boxtypelist">
        <li
          class="current"
          @click="openBox(i,item)"
          v-for="(item,i) in boxList"
          :key="i"
          :class="{active: current===i}"
        >
          <div class="sb_boxtItemT">
            <div class="sb_boxtItemT1">{{item.boxtype}}({{item.boxlivecount}}格可用)</div>
            <div class="sb_boxtItemT2">{{item.boxfee}}</div>
          </div>
        </li>
      </ul>
      <div class="sb_chooseBoxBtmWhite"></div>
      <div class="sb_chooseBoxBtm">选择箱子类型后将立即为您打开箱门。</div>
      <!-- <div class="sb_succesBtn">
        <div class="sb_succesBtnL" @click="goHome">返回首页</div>
        <div class="sb_succesBtnR" @click="toLogo">继续投递</div>
      </div>-->
    </div>
    <div id="HBox">
      <div class="mpTc_title">如何存件</div>
      <div class="mpTc_content">
        <div class="mpTc_box">
          <div class="mpTc_boxL">1</div>
          <div class="mpTc_boxR">
            <div class="mpTc_boxRTi">选择箱子类型</div>
            <div class="mpTc_boxRCont">根据快递实际大小选择箱子类型，若开箱后不合适可重新选箱。</div>
          </div>
        </div>
        <div class="mpTc_box">
          <div class="mpTc_boxL">2</div>
          <div class="mpTc_boxR">
            <div class="mpTc_boxRTi">填写收件信息</div>
            <div class="mpTc_boxRCont">填写收件人手机号、快递单号，选择物品类型等信息。</div>
          </div>
        </div>
        <div class="mpTc_box">
          <div class="mpTc_boxL">3</div>
          <div class="mpTc_boxR">
            <div class="mpTc_boxRTi">支付投递费用</div>
            <div class="mpTc_boxRCont">支付投递费用并完成投递。</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "../../assets/js/jquery.hDialog.js";
import { Resource } from "../../utils/api.js";
import tooltipbox from "../../assets/js/tooltipbox.js";
import VueElementLoading from "vue-element-loading";
import { getCookie } from "../../utils/until";
export default {
  components: {
    VueElementLoading
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      flag: 0,
      current: "",
      boxList: [],
      boxInfo: {},
      show: false
    };
  },
  mounted() {
    document.title = "快速投递";
    this.init();
    $.dialogDiy(
      "confirm",
      "温馨提示",
      "您已在本柜打开1个箱子，需要继续完成操作吗？",
      1,
      "重新选箱",
      "继续操作",
      function() {}
    );
  },
  methods: {
    init() {
      if (!localStorage.getItem("erCode")) {
        let _this = this;
        $.ajax({
          type: "GET",
          url: "http://wx.luoyangjinmei.com/getWxinter1.ashx",
          //  url: "http://vue2.jianku.com.cn/000.php",
          // data: {username:$("#username").val(), content:$("#content").val()},
          dataType: "json",
          data: { url: location.href.split("#")[0] },
          success: function(data) {
            console.log(data);
            _this.wx.config({
              debug: false,
              appId: "wxd093959d6ee082a9",
              timestamp: data.timestamp,
              nonceStr: data.noncestr,
              signature: data.signature,
              jsApiList: [
                // 所有要调用的 API 都要加到这个列表中
                "checkJsApi",

                "onMenuShareTimeline",

                "onMenuShareAppMessage",

                "onMenuShareQQ",

                "onMenuShareWeibo",

                "hideMenuItems",

                "showMenuItems",

                "hideAllNonBaseMenuItem",

                "showAllNonBaseMenuItem",

                "translateVoice",

                "startRecord",

                "stopRecord",

                "onRecordEnd",

                "playVoice",

                "pauseVoice",

                "stopVoice",

                "uploadVoice",

                "downloadVoice",

                "chooseImage",

                "previewImage",

                "uploadImage",

                "downloadImage",

                "getNetworkType",

                "openLocation",

                "getLocation",

                "hideOptionMenu",

                "showOptionMenu",

                "closeWindow",

                "scanQRCode",

                "chooseWXPay",

                "openProductSpecificView",

                "addCard",

                "chooseCard",

                "openCard"
              ]
            });
            _this.wx.error(function(res) {
              alert("出错了：" + res.errMsg); //这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
            });
            _this.wx.ready(function() {
              _this.wx.checkJsApi({
                jsApiList: ["scanQRCode"],
                success: function(res) {}
              });
            });
            //点击按钮扫描二维码
            _this.wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
              success: function(res) {
                localStorage.setItem("erCode", res.ercode);
                _this
                  .$fetch(Resource.getboxtypeinfos, {
                    cabinetId: localStorage.getItem("erCode")
                  })
                  .then(result => {
                    _this.boxList = result;
                  });
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              }
            });
          }
        });
      } else {
        this.$fetch(Resource.getboxtypeinfos, {
          cabinetId: localStorage.getItem("erCode")
        }).then(res => {
          this.boxList = res;
        });
      }
    },
    toLogo() {
      console.log(Object.keys(this.boxInfo).length);
      if (!Object.keys(this.boxInfo).length) {
        tooltipbox.show("请选择箱子");
      } else {
        this.$router.push({
          name: "expressSend",
          query: {
            boxInfo: JSON.stringify(this.boxInfo)
          }
        });
      }
    },
    goHome() {
      this.$router.replace({
        path: "/index"
      });
    },
    openBox(index, item) {
      console.log(item);
      this.show = true;
      this.$fetch(Resource.couriopenbox, {
        courierId: "2486c4c5-b224-4a3e-b987-2f2578e03643",
        openid: getCookie("openid"),
        cabinetId: localStorage.getItem("erCode"),
        boxtype: item.boxtype == "大格" ? 4 : item.boxtype == "中格" ? 3 : 2,
        boxfee: item.boxfee ? item.boxfee.substr(1) : ""
      })
        .then(res => {
          setTimeout(() => {
            this.show = false;
            if (res.status) {
              this.$router.push({
                path: "/expressSend",
                query: {
                  boxInfo: JSON.stringify(this.boxInfo),
                  boxNo: res.boxNo
                }
              });
            } else {
              tooltipbox.show(res.msg);
            }
          }, 1000);
          this.current = index;
          this.boxInfo = item;
        })
        .catch(err => {});
    },
    openDialog() {
      if (this.flag) {
        return;
      } else {
        this.flag = 1;
        $(".sb_boxtypeTiR").hDialog({
          title: "", // 是否显示带标题
          height: 500, // 配置高度 px
          width: 300, // 配置宽度 px
          modalHide: true, // 点击空白是否关闭弹窗
          boxBg: "blue", // 改变弹框背景色
          effect: "zoomOut", // 关闭效果
          closeHide: true, //是否隐藏关闭按钮
          autoShow: false,
          box: "#HBox"
        });
      }
    }
  }
};
</script>
<style scoped>
@import url("../../assets/css/style.css");
@import url("../../assets/css/animate.min.css");
@import url("../../assets/css/common.css");
.active {
  background: #f1f1f1 !important;
  color: #8f8f8f !important;
  border: 0 !important;
}
.velmld-overlay {
  font-size: 0.44rem;
}
</style>

