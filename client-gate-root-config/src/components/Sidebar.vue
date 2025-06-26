<template>
  <div :class="s.sidebar">
    <!-- Header -->
    <div :class="s.sidebarHeader">
      <div :class="s.brand">
        <div :class="s.brandIcon"></div>
        <h3 :class="[s.brandTitle, 'whitespace-nowrap']">S-CRM</h3>
      </div>
      <button :class="s.toggleBtn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M11 6L5 12L11 18"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 6L13 12L19 18"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <div :class="s.sidebarContent">
      <!-- Quản lý chung -->
      <div :class="s.navSection">
        <div :class="s.sectionHeader">
          <h4 :class="s.sectionTitle">Quản lý chung</h4>
        </div>
        <div :class="s.navItems">
          <div :class="[s.navItem, s.active]">
            <div :class="s.navItemContent">
              <img
                :src="image('icon-business.svg')"
                alt=""
                :class="s.navIcon"
              />
              <span :class="s.navText">Doanh nghiệp</span>
            </div>
          </div>
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img :src="image('icon-revenue.svg')" alt="" :class="s.navIcon" />
              <span :class="s.navText">Doanh thu và hoa hồng</span>
            </div>
          </div>
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img :src="image('icon-issues.svg')" alt="" :class="s.navIcon" />
              <span :class="s.navText">Vấn đề</span>
            </div>
          </div>
        </div>
      </div>

      <div :class="s.divider"></div>

      <!-- Marketing -->
      <div :class="s.navSection">
        <div :class="s.sectionHeader">
          <h4 :class="s.sectionTitle">Marketing</h4>
        </div>
        <div :class="s.navItems">
          <div :class="[s.navItem, s.withBadge]">
            <div :class="s.navItemContent">
              <img
                :src="image('icon-subscriber.svg')"
                alt=""
                :class="s.navIcon"
              />
              <span :class="s.navText">Subscriber</span>
            </div>
            <div :class="s.badge">10</div>
          </div>
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img
                :src="image('icon-campaign.svg')"
                alt=""
                :class="s.navIcon"
              />
              <span :class="s.navText">Campaign</span>
            </div>
          </div>
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img :src="image('icon-voucher.svg')" alt="" :class="s.navIcon" />
              <span :class="s.navText">Voucher</span>
            </div>
          </div>
        </div>
      </div>

      <div :class="s.divider"></div>

      <!-- Sale -->
      <div :class="s.navSection">
        <div :class="s.sectionHeader">
          <h4 :class="s.sectionTitle">Sale</h4>
        </div>
        <div :class="s.navItems">
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img :src="image('icon-contact.svg')" alt="" :class="s.navIcon" />
              <span :class="s.navText">Contact</span>
            </div>
          </div>
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img
                :src="image('icon-opportunities.svg')"
                alt=""
                :class="s.navIcon"
              />
              <span :class="s.navText">Opportunities</span>
            </div>
          </div>
        </div>
      </div>

      <div :class="s.divider"></div>

      <!-- Admin -->
      <div :class="s.navSection">
        <div :class="s.sectionHeader">
          <h4 :class="s.sectionTitle">Admin</h4>
        </div>
        <div :class="s.navItems">
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img
                :src="image('icon-employee.svg')"
                alt=""
                :class="s.navIcon"
              />
              <span :class="s.navText">Nhân viên</span>
            </div>
          </div>
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img
                :src="image('icon-settings.svg')"
                alt=""
                :class="s.navIcon"
              />
              <span :class="s.navText">Cài đặt</span>
            </div>
          </div>
          <div :class="s.navItem">
            <div :class="s.navItemContent">
              <img
                :src="image('icon-approval.svg')"
                alt=""
                :class="s.navIcon"
              />
              <span :class="s.navText">Phê duyệt</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div :class="s.sidebarFooter">
      <div :class="s.userProfile">
        <div :class="s.avatarContainer">
          <div :class="s.avatar">
            <div :class="s.avatarFallback">NQ</div>
          </div>
          <div :class="s.statusIndicator"></div>
        </div>
        <div :class="s.userInfo">
          <div :class="s.userName">Nhật Quang</div>
          <div :class="s.userEmail">quangsmit@gmail.com</div>
        </div>
      </div>
      <button :class="s.expandBtn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="4.5"
            y="4.5"
            width="19"
            height="19"
            rx="18"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M11.5 6.5L17.5 12.5L11.5 18.5"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCssModule } from "vue";

const image = (file: string) => {
  return require(`../assets/images/${file}`);
};

const s = useCssModule();
</script>

<style lang="scss" module>
.sidebar {
  width: 300px;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8edf2;
}

.sidebarHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  gap: 66px;
  height: 80px;
  border-bottom: 1px solid #e8edf2;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brandIcon {
  width: 40px;
  height: 40px;
  background-color: #0069fe;
  border-radius: 8px;
}

.brandTitle {
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.25;
  color: #000a2c;
  margin: 0;
}

.toggleBtn {
  width: 40px;
  height: 40px;
  background-color: #f9f8fc;
  border: none;
  border-radius: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a2229;

  &:hover {
    background-color: #e8edf2;
  }
}

.sidebarContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 40px 0;
  overflow-y: auto;
}

.navSection {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sectionHeader {
  display: flex;
  padding: 0 24px;
  height: 40px;
  align-items: center;
}

.sectionTitle {
  font-family: "Inter Tight", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.43;
  color: #002071;
  margin: 0;
}

.navItems {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 20px;
}

.navItem {
  display: flex;
  align-items: center;

  &.withBadge {
    justify-content: space-between;

    .navItemContent {
      flex: 1;
    }
  }

  &.active .navItemContent {
    background-color: #cbe9fe;

    .navIcon {
      color: #1a2229;

      &[src] {
        filter: brightness(0) saturate(100%) invert(11%) sepia(11%)
          saturate(1406%) hue-rotate(183deg) brightness(96%) contrast(95%);
      }
    }

    .navText {
      color: #000a2c;
    }
  }

  &:not(.active) .navItemContent:hover {
    background-color: #f9f8fc;
  }
}

.navItemContent {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.2s ease;
}

.navIcon {
  width: 20px;
  height: 20px;
  color: #7d91a6;
  flex-shrink: 0;

  &[src] {
    filter: brightness(0) saturate(100%) invert(50%) sepia(18%) saturate(1085%)
      hue-rotate(183deg) brightness(94%) contrast(89%);
  }
}

.navText {
  font-family: "Inter Tight", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.43;
  color: #536678;
}

.badge {
  background-color: #e2f3ff;
  border: 1px solid #cbe9fe;
  border-radius: 999px;
  padding: 3px 6px;
  font-family: "Inter Tight", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.5;
  color: #0069fe;
  min-width: 20px;
  text-align: center;
}

.divider {
  width: 260px;
  height: 1px;
  background-color: #e8edf2;
  margin: 0 auto;
}

.sidebarFooter {
  border-top: 1px solid #e8edf2;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 41px;
}

.userProfile {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.avatarContainer {
  position: relative;
  width: 44px;
  height: 44px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #0069fe;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d9d9d9;
  overflow: hidden;
}

.avatarFallback {
  font-family: "Inter Tight", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #000a2c;
}

.statusIndicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #12b76a;
  border: 1.5px solid #ffffff;
  border-radius: 50%;
}

.userInfo {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.userName {
  font-family: "Inter Tight", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  color: #000a2c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.userEmail {
  font-family: "Inter Tight", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.43;
  color: #7d91a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expandBtn {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #c5ced8;

  &:hover {
    color: #7d91a6;
  }
}

// Global utility class (nếu cần thiết)
:global(.whitespace-nowrap) {
  white-space: nowrap;
}
</style>
