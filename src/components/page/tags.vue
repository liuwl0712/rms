<template>
  <div>
    <el-tag
      :key="tag.path"
      v-for="tag in tags"
      :closable="tag.closable"
      :type="tag.type"
      :disable-transitions="false"
      :effect="tag.effect"
      @click="toPath(tag)"
      @close="handleClose(tag)"
      v-if="tag.path=='/homePage'"
      @contextmenu.native.prevent="handleClickContextMenu($event,tag)"
    >
      {{tag.title}}
    </el-tag>
    <div id="itxst">
      <el-tag
        :key="tag.path"
        v-for="tag in tags"
        :closable="tag.closable"
        :type="tag.type"
        :disable-transitions="false"
        :effect="tag.effect"
        @click="toPath(tag)"
        @close="handleClose(tag)"
        v-if="tag.path!='/homePage'"
        @contextmenu.native.prevent="handleClickContextMenu($event,tag)"
      >
        {{tag.title}}
      </el-tag>
    </div>
    <div v-show="contextMenuVisible">
      <ul
        :style="{left:left+'px',top:top+'px'}"
        class="contextmenu"
      >
        <li @click="closeOther">
          <el-button type="text">关闭其他</el-button>
        </li>
        <li @click="closeAll">
          <el-button type="text">关闭所有</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  data() {
    return {
      //标签列表
      tags: [
        {
          type: "",
          closable: false,
          title: "首页",
          path: "/homePage",
          effect: "dark",
        },
      ],
      //鼠标右键菜单是否展示
      contextMenuVisible: false,
      top: "",
      left: "",
      //选中标签
      handleClickTag: "",
    };
  },
  /**
   * 监听路由变化，激活对应的标签页，通过更改标签type和effect属性来做激活和未激活状态的更改
   */
  watch: {
    $route: function (to) {
      let flag = true;
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].path == to.path) {
          this.tags[i].type = "";
          this.tags[i].effect = "dark";
          flag = false;
        } else {
          this.tags[i].type = "info";
          this.tags[i].effect = "plain";
        }
      }
      if (flag) {
        for (let i = 0; i < this.tags.length; i++) {
          this.tags[i].type = "info";
          this.tags[i].effect = "plain";
        }
        this.tags.push({
          type: "",
          closable: true,
          title: to.meta.title,
          path: to.path,
          effect: "dark",
          closable: true,
        });
      }
    },
  },
  /**
   * 完成挂载，把值渲染进去
   */
  mounted() {
    this.rowDrop();
    const els = document.getElementById("app");
    els.onclick = this.closeContextMenu;
  },
  methods: {
    /**
     * 关闭鼠标左键菜单
     */
    closeContextMenu() {
      this.contextMenuVisible = false;
    },
    /**
     * 打开鼠标左键菜单
     */
    handleClickContextMenu(e, tag) {
      this.handleClickTag = tag;
      this.contextMenuVisible = true;
      this.left = e.layerX + 210;
      this.top = e.layerY + 80;
    },
    /**
     * 鼠标左键菜单--关闭全部
     */
    closeAll() {
      this.tags = [
        {
          type: "",
          closable: false,
          title: "首页",
          path: "/homePage",
          effect: "dark",
        },
      ];
      this.$router.push({ path: "/homePage" });
    },
    /**
     * 鼠标左键菜单--关闭其他
     */
    closeOther() {
      if (this.handleClickTag.path == "/homePage") {
        this.closeAll();
      } else {
        this.tags = [
          {
            type: "info",
            closable: false,
            title: "首页",
            path: "/homePage",
            effect: "plain",
          },
        ];
        this.tags.push(this.handleClickTag);
        this.$router.push({ path: this.handleClickTag.path });
      }
    },
    /**
     * 点击标签跳转对应标签页面
     */
    toPath(tag) {
      this.$router.push({ path: tag.path });
    },
    /**
     * 关闭标签，并打开此标签前一个的页面
     */
    handleClose(tag) {
      if (tag.path != this.$route.path) {
        for (let i = 0; i < this.tags.length; i++) {
          if (tag.path == this.tags[i].path) {
            this.tags.splice(i, 1);
          }
        }
      } else {
        for (let i = 0; i < this.tags.length; i++) {
          if (tag.path == this.tags[i].path) {
            this.tags.splice(i, 1);
            this.$router.push({ path: this.tags[i - 1].path });
          }
        }
      }
    },
    /**
     * 拖拽标签
     */
    rowDrop() {
      const el = document.getElementById("itxst");
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tags.splice(oldIndex + 1, 1)[0];
          _this.tags.splice(newIndex + 1, 0, currRow);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#itxst {
  display: inline;
}
.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.contextmenu li {
  margin: 0;
  padding: 0px 22px;
}
.contextmenu li:hover {
  background: #f2f2f2;
  cursor: pointer;
}
.contextmenu li button {
  color: #2c3e50;
}
</style>