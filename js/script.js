// Khởi tạo các tương tác sau khi HTML đã sẵn sàng.
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#site-menu");
  const menuLinks = document.querySelectorAll(".nav-link");
  const form = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const avatar = document.querySelector(".portrait-frame img");

  // Hiện khung hướng dẫn thay ảnh nếu tệp đại diện không tồn tại.
  if (avatar) {
    avatar.addEventListener("error", () => {
      avatar.hidden = true;
      avatar.nextElementSibling.hidden = false;
    });
  }

  // Mở/đóng menu điện thoại và đóng menu sau khi chọn một mục.
  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      menuButton.setAttribute("aria-label", isExpanded ? "Mở menu" : "Đóng menu");
      menu.classList.toggle("is-open", !isExpanded);
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Mở menu");
        menu.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Mở menu");
        menu.classList.remove("is-open");
        menuButton.focus();
      }
    });
  }

  // Hiện dần nội dung và chạy thanh kỹ năng khi chúng vào vùng nhìn thấy.
  const revealItems = document.querySelectorAll(".reveal");
  document.querySelectorAll(".skill-track span").forEach((bar) => {
    bar.parentElement.parentElement.style.setProperty("--skill-level", bar.dataset.level);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Cập nhật mục menu đang xem dựa trên section nằm trong viewport.
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          menuLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Kiểm tra trường nhập và hiển thị phản hồi; bản tĩnh không gửi dữ liệu đi.
  if (form && formStatus) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.classList.remove("error");

      if (!form.checkValidity()) {
        formStatus.textContent = "Vui lòng nhập họ tên, email hợp lệ và nội dung ít nhất 10 ký tự.";
        formStatus.classList.add("error");
        form.reportValidity();
        return;
      }

      const senderName = form.elements.name.value.trim();
      formStatus.textContent = `Cảm ơn ${senderName}, tin nhắn đã được kiểm tra. Đây là bản demo nên chưa gửi dữ liệu.`;
      form.reset();
    });
  }
});