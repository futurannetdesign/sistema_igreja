class SecretaryPanel {
  constructor() {
    this.currentSection = "dashboard";
    this.init();
  }

  init() {
    this.checkSecretaryAuth();
    this.setupEventListeners();
    this.loadDashboard();
  }

  checkSecretaryAuth() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "secretary") {
      window.location.href = "/";
    }
  }

  setupEventListeners() {
    document
      .getElementById("logout")
      .addEventListener("click", () => this.handleLogout());

    document.querySelectorAll(".menu a").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (e.target.id !== "logout") {
          e.preventDefault();
          this.navigateToSection(e.target.getAttribute("href").substring(1));
        }
      });
    });
  }

  navigateToSection(section) {
    this.currentSection = section;
    switch (section) {
      case "membros":
        this.loadMembers();
        break;
      case "relatorios":
        this.loadReports();
        break;
      default:
        this.loadDashboard();
    }
  }

  getMembers() {
    const members = localStorage.getItem("members");
    return members ? JSON.parse(members) : [];
  }

  saveMembersStorage(members) {
    localStorage.setItem("members", JSON.stringify(members));
  }

  loadDashboard() {
    const members = this.getMembers();
    const total = members.length;
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-based
    const birthdays = members.filter(
      (m) => m.birthDate && new Date(m.birthDate).getMonth() === currentMonth
    ).length;

    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
      <h2>Dashboard da Secretaria</h2>
      <div class="stats-container">
        <div class="stat-card">
          <h3>Total de Membros</h3>
          <p class="stat-number">${total}</p>
        </div>
        <div class="stat-card">
          <h3>Aniversariantes do Mês</h3>
          <p class="stat-number">${birthdays}</p>
        </div>
      </div>
    `;
  }

  loadMembers() {
    const members = this.getMembers();
    let rows = "";
    members.forEach((m) => {
      rows += `
        <tr>
          <td><img src="${m.photo}" alt="${m.name}" class="member-photo"></td>
          <td>${m.name}</td>
          <td>${
            m.birthDate ? new Date(m.birthDate).toLocaleDateString("pt-BR") : ""
          }</td>
          <td>${
            m.baptismDate
              ? new Date(m.baptismDate).toLocaleDateString("pt-BR")
              : ""
          }</td>
          <td>${m.phone}</td>
          <td>
            <button onclick="secretaryPanel.editMember(${
              m.id
            })" class="btn-edit">Editar</button>
            <button onclick="secretaryPanel.deleteMember(${
              m.id
            })" class="btn-delete">Excluir</button>
          </td>
        </tr>
      `;
    });
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
      <h2>Gerenciar Membros</h2>
      <button class="btn-add" onclick="secretaryPanel.showAddMemberForm()">Adicionar Novo Membro</button>
      <div class="members-list">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Data Nascimento</th>
              <th>Data Batismo</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="members-table-body">
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  showAddMemberForm() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content modal-small">
        <h3>Adicionar Novo Membro</h3>
        <form id="addMemberForm" onsubmit="return secretaryPanel.handleAddMember(event)">
          <div class="form-row">
            <div class="form-group">
              <label>Nome:</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Foto:</label>
              <input type="file" name="photo" accept="image/*">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nascimento:</label>
              <input type="date" name="birthDate" required>
            </div>
            <div class="form-group">
              <label>Batismo:</label>
              <input type="date" name="baptismDate">
            </div>
          </div>
          <div class="form-group">
            <label>WhatsApp:</label>
            <input type="tel" name="phone" required>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-save">Salvar</button>
            <button type="button" class="btn-cancel" onclick="this.closest('.modal').remove()">Cancelar</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  handleAddMember(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const memberData = Object.fromEntries(formData);
    let members = this.getMembers();
    const newId = members.length
      ? Math.max(...members.map((m) => m.id)) + 1
      : 1;
    let photoUrl = "../../assets/avatar-placeholder.png";
    const photoFile = formData.get("photo");
    if (photoFile && photoFile.size > 0) {
      photoUrl = URL.createObjectURL(photoFile);
    }
    const newMember = {
      id: newId,
      photo: photoUrl,
      name: memberData.name,
      birthDate: memberData.birthDate,
      baptismDate: memberData.baptismDate || null,
      phone: memberData.phone,
      registrationDate: new Date().toISOString().split("T")[0],
    };
    members.push(newMember);
    this.saveMembersStorage(members);
    alert("Membro adicionado com sucesso!");
    event.target.closest(".modal").remove();
    this.loadMembers();
    this.loadDashboard();
    return false;
  }

  getMemberById(id) {
    const members = this.getMembers();
    return members.find((m) => m.id === id) || null;
  }

  editMember(id) {
    const member = this.getMemberById(id);
    if (!member) return;
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content modal-small">
        <h3>Editar Membro</h3>
        <form onsubmit="return secretaryPanel.handleEditMember(event, ${id})">
          <div class="form-row">
            <div class="form-group">
              <label>Nome:</label>
              <input type="text" name="name" value="${member.name}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nascimento:</label>
              <input type="date" name="birthDate" value="${
                member.birthDate
              }" required>
            </div>
            <div class="form-group">
              <label>Batismo:</label>
              <input type="date" name="baptismDate" value="${
                member.baptismDate || ""
              }">
            </div>
          </div>
          <div class="form-group">
            <label>WhatsApp:</label>
            <input type="tel" name="phone" value="${member.phone}" required>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-save">Atualizar</button>
            <button type="button" class="btn-cancel" onclick="this.closest('.modal').remove()">Cancelar</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  handleEditMember(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = Object.fromEntries(formData);
    let members = this.getMembers();
    const index = members.findIndex((m) => m.id === id);
    if (index !== -1) {
      members[index] = {
        ...members[index],
        ...updatedData,
      };
      this.saveMembersStorage(members);
      alert("Membro atualizado com sucesso!");
      event.target.closest(".modal").remove();
      this.loadMembers();
      this.loadDashboard();
    }
    return false;
  }

  deleteMember(id) {
    let members = this.getMembers();
    const index = members.findIndex((m) => m.id === id);
    if (
      index !== -1 &&
      confirm("Tem certeza que deseja excluir este membro?")
    ) {
      members.splice(index, 1);
      this.saveMembersStorage(members);
      alert("Membro excluído com sucesso!");
      this.loadMembers();
      this.loadDashboard();
    }
  }

  loadReports() {
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
      <h2>Relatórios</h2>
      <div class="reports-container">
        <div class="report-card">
          <h3>Lista de Membros</h3>
          <button class="btn-report">Gerar PDF</button>
        </div>
        <div class="report-card">
          <h3>Aniversariantes</h3>
          <button class="btn-report">Gerar PDF</button>
        </div>
      </div>
    `;
  }

  handleLogout() {
    localStorage.clear();
    window.location.href = "/index.html";
  }
}

const secretaryPanel = new SecretaryPanel();
