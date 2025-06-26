<template>
  <div :class="$style.header">
    <!-- Background with light effects -->
    <div :class="$style.bgHeader">
      <div :class="$style.lightEffects">
        <div :class="[$style.ellipse, $style.ellipse1]"></div>
        <div :class="[$style.ellipse, $style.ellipse2]"></div>
        <div :class="[$style.ellipse, $style.ellipse3]"></div>
        <div :class="$style.lightGroup">
          <div :class="[$style.lightRect, $style.lightRect1]"></div>
          <div :class="[$style.lightRect, $style.lightRect2]"></div>
          <div :class="[$style.lightRect, $style.lightRect3]"></div>
          <div :class="$style.lightEllipse"></div>
          <div :class="[$style.lightVector, $style.lightVector1]"></div>
          <div :class="[$style.lightVector, $style.lightVector2]"></div>
          <div :class="[$style.lightVector, $style.lightVector3]"></div>
          <div :class="[$style.lightVector, $style.lightVector4]"></div>
        </div>
      </div>
    </div>

    <!-- Header content -->
    <div :class="$style.headerContent">
      <div :class="$style.titleSection">
        <h1 :class="$style.pageTitle">{{ title }}</h1>
      </div>
      <div v-if="showStatusTabs" :class="$style.statusTabs">
        <div :class="$style.tabContainer">
          <div :class="[$style.tab, $style.active]">
            <span :class="$style.tabText">Chính thức</span>
          </div>
          <div :class="$style.tab">
            <span :class="$style.tabText">Dùng thử</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  showStatusTabs?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Doanh nghiệp",
  showStatusTabs: true,
});
</script>

<style lang="scss" module>
.header {
  position: relative;
  width: 100%;
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid #e8edf2;
  overflow: hidden;
}

.bgHeader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #ffffff 6.18%,
    #98cffe 28.84%,
    #b3dcfe 67.57%,
    #f5fbff 100%
  );

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at 94.5% 81.2%,
      #98cffe 0%,
      transparent 100%
    );
  }
}

.lightEffects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ellipse {
  position: absolute;
  border-radius: 50%;
  filter: blur(27px);

  &.ellipse1 {
    width: 356px;
    height: 309px;
    right: 294px;
    top: -105px;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.94) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  &.ellipse2 {
    width: 334px;
    height: 334px;
    left: 217px;
    top: -127px;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.94) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  &.ellipse3 {
    width: 334px;
    height: 334px;
    left: 775px;
    top: -153px;
    background: linear-gradient(
      45deg,
      rgba(152, 207, 254, 0.41) 0%,
      rgba(152, 207, 254, 0) 100%
    );
  }
}

.lightGroup {
  position: absolute;
  right: 0;
  top: -397px;
  width: 831px;
  height: 833px;
}

.lightRect {
  position: absolute;
  background: linear-gradient(
    135deg,
    #53a2ff 21.48%,
    rgba(83, 162, 255, 0) 78.16%
  );

  &.lightRect1 {
    width: 292px;
    height: 282px;
    left: 392px;
    top: 320px;
    filter: blur(12px);
  }

  &.lightRect2 {
    width: 302px;
    height: 293px;
    left: 352px;
    top: 244px;
    filter: blur(6px);
    opacity: 0.3;
  }

  &.lightRect3 {
    width: 311px;
    height: 302px;
    left: 378px;
    top: 251px;
    filter: blur(11px);
    opacity: 0.86;
  }
}

.lightEllipse {
  position: absolute;
  width: 226px;
  height: 315px;
  left: 477px;
  top: 229px;
  background: #50a0ff;
  border-radius: 50%;
  filter: blur(96px);
  opacity: 0.31;
}

.lightVector {
  position: absolute;
  border: 1px solid;
  border-image: linear-gradient(135deg, #81bbff 0%, rgba(129, 187, 255, 0) 100%)
    1;

  &.lightVector1 {
    width: 338px;
    height: 252px;
    left: 272px;
    top: 396px;
    filter: blur(8px);
  }

  &.lightVector2 {
    width: 337px;
    height: 250px;
    left: 281px;
    top: 424px;
    filter: blur(7px);
  }

  &.lightVector3 {
    width: 171px;
    height: 128px;
    left: 422px;
    top: 361px;
    border-width: 2px;
    filter: blur(7px);
  }

  &.lightVector4 {
    width: 184px;
    height: 145px;
    left: 43px;
    top: 318px;
    border-width: 2px;
    filter: blur(7px);
  }
}

.headerContent {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 18px 40px;
  height: 100%;
}

.titleSection {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
}

.pageTitle {
  font-family: "Inter Tight", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.33;
  color: #000a2c;
  margin: 0;
}

.statusTabs {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
}

.tabContainer {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  background: #f9f8fc;
  border: 1px solid #e8edf2;
  border-radius: 8px;
}

.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  width: 92px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;

  &.active {
    background: #0069fe;

    .tabText {
      color: #f9f8fc;
    }
  }

  &:not(.active) {
    .tabText {
      color: #000a2c;
    }

    &:hover {
      background: rgba(0, 105, 254, 0.05);
    }
  }
}

.tabText {
  font-family: "Inter Tight", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.43;
  white-space: nowrap;
}
</style>
