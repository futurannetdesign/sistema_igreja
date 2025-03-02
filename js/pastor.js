class PastorPanel {
  constructor() {
    this.currentSection = "dashboard";
    this.init();
  }

  init() {
    this.checkPastorAuth();
    this.setupEventListeners();
    this.loadDashboard();
  }

  checkPastorAuth() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "pastor") {
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
      case "batismos":
        this.loadBaptisms();
        break;
      default:
        this.loadDashboard();
    }
  }

  getMembers() {
    const members = localStorage.getItem("members");
    return members ? JSON.parse(members) : [];
  }

  loadDashboard() {
    const members = this.getMembers();
    const total = members.length;
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
      <h2>Dashboard Pastoral</h2>
      <div class="stats-container">
        <div class="stat-card">
          <h3>Total de Membros</h3>
          <p class="stat-number">${total}</p>
        </div>
        <div class="stat-card">
          <h3>Batismos este Ano</h3>
          <p class="stat-number">0</p>
        </div>
        <div class="stat-card">
          <h3>Candidatos ao Batismo</h3>
          <p class="stat-number">0</p>
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
          <td>${m.name}</td>
          <td>${
            m.baptismDate
              ? new Date(m.baptismDate).toLocaleDateString("pt-BR")
              : ""
          }</td>
          <td>${m.phone}</td>
          <td>
            <button onclick="pastorPanel.editMember(${
              m.id
            })" class="btn-edit">Editar</button>
            <button onclick="pastorPanel.deleteMember(${
              m.id
            })" class="btn-delete">Excluir</button>
          </td>
        </tr>
      `;
    });
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
      <h2>Membros da Igreja</h2>
      <div class="search-box">
        <input type="text" placeholder="Buscar membro...">
        <button class="btn-search">Buscar</button>
      </div>
      <button class="btn-add" onclick="pastorPanel.showAddMemberForm()">Adicionar Novo Membro</button>
      <div class="members-list">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data Batismo</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="members-table-body">${rows}</tbody>
        </table>
      </div>
    `;
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
        <form onsubmit="return pastorPanel.handleEditMember(event, ${id})">
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
      localStorage.setItem("members", JSON.stringify(members));
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
      localStorage.setItem("members", JSON.stringify(members));
      alert("Membro excluído com sucesso!");
      this.loadMembers();
      this.loadDashboard();
    }
  }

  showAddMemberForm() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content modal-small">
        <h3>Adicionar Novo Membro</h3>
        <form id="addMemberForm" onsubmit="return pastorPanel.handleAddMember(event)">
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
    const members = this.getMembers();
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
    localStorage.setItem("members", JSON.stringify(members));
    alert("Membro adicionado com sucesso!");
    event.target.closest(".modal").remove();
    this.loadMembers();
    this.loadDashboard();
    return false;
  }

  // Funções para gerir candidatos ao batismo
  getBaptismCandidates() {
    const candidates = localStorage.getItem("baptismCandidates");
    return candidates ? JSON.parse(candidates) : [];
  }

  saveBaptismCandidates(candidates) {
    localStorage.setItem("baptismCandidates", JSON.stringify(candidates));
  }

  // Atualize para incluir botões de edição e exclusão
  loadBaptismCandidates() {
    const candidates = this.getBaptismCandidates();
    let upcomingHTML = "";
    let preparationHTML = "";
    candidates.forEach((candidate) => {
      const candidateHTML = `
        <div>
          ${candidate.name} - ${new Date(candidate.prepDate).toLocaleDateString(
        "pt-BR"
      )} - ${candidate.contact}<br>
          Status: ${candidate.status} <br>
          Detalhes: ${candidate.details || "Nenhum detalhe"} <br>
          <button onclick="pastorPanel.editBaptismCandidate(${
            candidate.id
          })" class="btn-edit">Editar</button>
          <button onclick="pastorPanel.deleteBaptismCandidate(${
            candidate.id
          })" class="btn-delete">Excluir</button>
          <button onclick="pastorPanel.sendNotification(${
            candidate.id
          })" class="btn-notify">Notificar</button>
        </div>
      `;
      if (candidate.status.trim() === "finalizado") {
        upcomingHTML += candidateHTML;
      } else {
        preparationHTML += candidateHTML;
      }
    });
    document.getElementById("upcoming-baptisms").innerHTML =
      upcomingHTML || "<p>Nenhum próximo batismo</p>";
    document.getElementById("baptism-candidates").innerHTML =
      preparationHTML || "<p>Nenhum candidato em preparação</p>";
  }

  // Adicione funcionalidade para editar candidato
  editBaptismCandidate(id) {
    const candidates = this.getBaptismCandidates();
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content modal-small">
        <h3>Editar Candidato</h3>
        <form onsubmit="return pastorPanel.handleEditBaptismCandidate(event, ${id})">
          <div class="form-row">
            <div class="form-group">
              <label>Nome:</label>
              <input type="text" name="name" value="${candidate.name}" required>
            </div>
            <div class="form-group">
              <label>Data de Preparação:</label>
              <input type="date" name="prepDate" value="${
                candidate.prepDate
              }" required>
            </div>
          </div>
          <div class="form-group">
            <label>Contato:</label>
            <input type="tel" name="contact" value="${
              candidate.contact
            }" required>
          </div>
          <div class="form-group">
            <label>Detalhes da Preparação:</label>
            <textarea name="details" placeholder="Aulas, estudos, encontros, avaliações...">${
              candidate.details || ""
            }</textarea>
          </div>
          <div class="form-group">
            <label>Status do Candidato:</label>
            <select name="status" required>
              <option value="iniciado" ${
                candidate.status === "iniciado" ? "selected" : ""
              }>Iniciado</option>
              <option value="em_progresso" ${
                candidate.status === "em_progresso" ? "selected" : ""
              }>Em Progresso</option>
              <option value="finalizado" ${
                candidate.status === "finalizado" ? "selected" : ""
              }>Finalizado</option>
            </select>
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

  handleEditBaptismCandidate(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = Object.fromEntries(formData);
    let candidates = this.getBaptismCandidates();
    const index = candidates.findIndex((c) => c.id === id);
    if (index !== -1) {
      candidates[index] = {
        ...candidates[index],
        ...updatedData,
      };
      this.saveBaptismCandidates(candidates);
      alert("Candidato atualizado com sucesso!");
      event.target.closest(".modal").remove();
      this.loadBaptismCandidates();
    }
    return false;
  }

  deleteBaptismCandidate(id) {
    let candidates = this.getBaptismCandidates();
    const index = candidates.findIndex((c) => c.id === id);
    if (
      index !== -1 &&
      confirm("Tem certeza que deseja excluir este candidato?")
    ) {
      candidates.splice(index, 1);
      this.saveBaptismCandidates(candidates);
      alert("Candidato excluído com sucesso!");
      this.loadBaptismCandidates();
    }
  }

  // Atualiza a função loadBaptisms() para chamar loadBaptismCandidates()
  loadBaptisms() {
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
      <h2>Gestão de Batismos</h2>
      <button class="btn-add" onclick="pastorPanel.showAddBaptismCandidate()">Novo Candidato ao Batismo</button>
      <div class="baptisms-container">
        <div class="baptism-card">
          <h3>Próximos Batismos</h3>
          <button class="btn-add" onclick="pastorPanel.showUpcomingBatisms()">Ver Próximos Batismos</button>
          <div class="baptism-list" id="upcoming-baptisms" style="display: none;">
            <!-- Lista será carregada dinamicamente -->
          </div>
        </div>
        <div class="baptism-card">
          <h3>Candidatos em Preparação</h3>
          <div class="baptism-list" id="baptism-candidates">
            <!-- Lista será carregada dinamicamente -->
          </div>
        </div>
      </div>
    `;
    this.loadBaptismCandidates();
  }

  showUpcomingBatisms() {
    const upcomingDiv = document.getElementById("upcoming-baptisms");
    upcomingDiv.style.display =
      upcomingDiv.style.display === "none" || !upcomingDiv.style.display
        ? "block"
        : "none";
  }

  showAddBaptismCandidate() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content modal-small">
        <h3>Novo Candidato ao Batismo</h3>
        <form onsubmit="return pastorPanel.handleAddBaptismCandidate(event)">
          <div class="form-row">
            <div class="form-group">
              <label>Nome:</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Data de Preparação:</label>
              <input type="date" name="prepDate" required>
            </div>
          </div>
          <div class="form-group">
            <label>Contato:</label>
            <input type="tel" name="contact" required>
          </div>
          <div class="form-group">
            <label>Detalhes da Preparação:</label>
            <textarea name="details" placeholder="Aulas, estudos, encontros, avaliações..."></textarea>
          </div>
          <div class="form-group">
            <label>Status do Candidato:</label>
            <select name="status" required>
              <option value="iniciado">Iniciado</option>
              <option value="em_progresso">Em Progresso</option>
              <option value="finalizado">Finalizado</option>
            </select>
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

  handleAddBaptismCandidate(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const candidateData = Object.fromEntries(formData);
    const candidates = this.getBaptismCandidates();
    const newId = candidates.length
      ? Math.max(...candidates.map((c) => c.id)) + 1
      : 1;
    const newCandidate = {
      id: newId,
      name: candidateData.name,
      prepDate: candidateData.prepDate,
      contact: candidateData.contact,
      details: candidateData.details || "",
      status: candidateData.status || "iniciado",
    };
    candidates.push(newCandidate);
    this.saveBaptismCandidates(candidates);
    alert("Candidato adicionado com sucesso!");
    event.target.closest(".modal").remove();
    this.loadBaptismCandidates();
    return false;
  }

  updateCandidateProgress(id, newStatus, newDetails) {
    let candidates = this.getBaptismCandidates();
    const index = candidates.findIndex((c) => c.id === id);
    if (index !== -1) {
      candidates[index].status = newStatus;
      candidates[index].details = newDetails;
      this.saveBaptismCandidates(candidates);
      alert("Progresso atualizado com sucesso!");
      this.loadBaptismCandidates();
    }
  }

  sendNotification(id) {
    const candidate = this.getBaptismCandidates().find((c) => c.id === id);
    if (candidate) {
      alert(
        `Enviando notificação para ${candidate.name} sobre etapas pendentes.`
      );
    }
  }

  loadReports() {
    const content = document.getElementById("dashboard-content");
    content.innerHTML = `
      <h2>Relatórios Pastorais</h2>
      <div class="reports-container">
        <div class="report-card">
          <h3>Relatório de Membros</h3>
          <button class="btn-report">Gerar PDF</button>
        </div>
        <div class="report-card">
          <h3>Relatório de Batismos</h3>
          <button class="btn-report">Gerar PDF</button>
        </div>
        <div class="report-card">
          <h3>Crescimento da Igreja</h3>
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

const pastorPanel = new PastorPanel();
