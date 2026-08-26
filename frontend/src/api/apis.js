import api from './client';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const studentApi = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  getAcademic: () => api.get('/students/academics'),
  getAcademics: () => api.get('/students/academics'),
  updateAcademic: (data) => api.post('/students/academics', data),
  saveAcademics: (data) => api.post('/students/academics', data),
  getSkills: () => api.get('/students/skills'),
  addSkill: (data) => api.post('/students/skills', data),
  updateSkill: (id, data) => api.put(`/students/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/students/skills/${id}`),
  getDashboard: () => api.get('/students/dashboard-summary'),
  getDashboardSummary: () => api.get('/students/dashboard-summary'),
  getAuditHistory: () => api.get('/students/profile/audit-history'),
  getSkillEvidence: () => api.get('/students/skills/evidence'),
  getExternalCoding: () => api.get('/students/external-coding'),
  updateExternalCoding: (data) => api.post('/students/external-coding', data),
};

export const facultyApi = {
  getDashboard: () => api.get('/faculty/dashboard'),
  executeIntervention: (data) => api.post('/faculty/interventions/execute', data),
  reviewIntegrityEvent: (id, data) => api.patch(`/faculty/integrity-events/${id}/review`, data),
};

export const coordinatorApi = {
  getDashboard: () => api.get('/coordinator/dashboard'),
  getReadinessMatrix: () => api.get('/coordinator/readiness-matrix'),
  getReadinessWeights: () => api.get('/coordinator/readiness-weights'),
  updateReadinessWeights: (data) => api.put('/coordinator/readiness-weights', data),
};

export const assignmentApi = {
  getAll: (params) => api.get('/assignments', { params }),
  create: (data) => api.post('/assignments', data),
  submit: (id, data) => api.post(`/assignments/${id}/submit`, data),
  grade: (id, data) => api.post(`/assignments/submissions/${id}/grade`, data),
};

export const ragApi = {
  query: (data) => api.post('/rag/query', data),
  getDocuments: () => api.get('/rag/documents'),
  upload: (data) => api.post('/rag/upload', data),
};

export const examProctorApi = {
  startSession: (data) => api.post('/exam-proctor/session/start', data),
  logEvent: (data) => api.post('/exam-proctor/events/log', data),
  autoSave: (data) => api.post('/exam-proctor/autosave', data),
  submitSecureExam: (data) => api.post('/exam-proctor/submit', data),
  getReview: (attemptId) => api.get(`/exam-proctor/review/${attemptId}`),
  getHistory: (assessmentId) => api.get(`/exam-proctor/history/${assessmentId}`),
  getFacultyAnalytics: (assessmentId) => api.get(`/exam-proctor/faculty/analytics/${assessmentId}`),
};

export const skillApi = {
  getAll: (params) => api.get('/skills', { params }),
  getCategorySummary: () => api.get('/skills/category-summary'),
  getMySkills: () => api.get('/skills/my-skills'),
  saveMySkill: (data) => api.post('/skills/my-skills', data),
  deleteMySkill: (id) => api.delete(`/skills/my-skills/${id}`),
};

export const assessmentApi = {
  getAll: (params) => api.get('/assessments', { params }),
  getById: (id) => api.get(`/assessments/${id}`),
  generateAI: (data) => api.post('/assessments/generate-ai', data),
  generateMockExam: (id, data) => api.post(`/assessments/${id}/generate`, data),
  getResult: (attemptId) => api.get(`/assessments/attempts/${attemptId}/result`),
  submit: (id, data) => api.post(`/assessments/${id}/submit`, data),
  getMySubmissions: () => api.get('/assessments/my/submissions'),
};

export const codeApi = {
  run: (data) => api.post('/code/run', data),
  getPracticeProblems: (params) => api.get('/code/problems', { params }),
  getProblemById: (id) => api.get(`/code/problems/${id}`),
  submitSolution: (id, data) => api.post(`/code/problems/${id}/submit`, data),
  saveCode: (data) => api.post('/code/save', data),
  getSavedCode: (problemId, params) => api.get(`/code/saved/${problemId}`, { params }),
  getMySubmissions: (params) => api.get('/code/submissions/my', { params }),
  aiAssist: (data) => api.post('/code/ai/assist', data),
};

export const learningApi = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getResources: (params) => api.get('/courses/resources/all', { params }),
  getMyPlan: () => api.get('/learning-plans/my-plan'),
  toggleTask: (data) => api.patch('/learning-plans/task-toggle', data),
  regeneratePlan: (data) => api.post('/learning-plans/regenerate', data),
  getHistory: () => api.get('/learning-plans/history'),
};

export const courseApi = learningApi;

export const companyApi = {
  getAll: (params) => api.get('/companies', { params }),
  getMatches: () => api.get('/companies/matches'),
  getById: (id) => api.get(`/companies/${id}`),
};

export const driveApi = {
  getAll: (params) => api.get('/drives', { params }),
  getById: (id) => api.get(`/drives/${id}`),
  apply: (id) => api.post(`/drives/${id}/apply`),
  getMyApplications: () => api.get('/drives/my/applications'),
};

export const resumeApi = {
  analyze: (data) => api.post('/resumes/analyze', data),
  analyzeText: (data) => api.post('/resumes/analyze', data),
  getLatestAnalysis: () => api.get('/resumes/latest-analysis'),
  getLatest: () => api.get('/resumes/latest-analysis'),
  uploadFile: (formData) => api.post('/resumes/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadPdf: (data) =>
    data
      ? api.post('/resumes/download-pdf', data, { responseType: 'blob' })
      : api.get('/resumes/download-pdf', { responseType: 'blob' }),
};

export const aiApi = {
  getSkillGap: (data) => api.post('/ai/skill-gap', data),
  getLatestSkillGap: () => api.get('/ai/skill-gap/latest'),
  getCareerRecommendations: () => api.get('/ai/career-recommendations'),
  chatAgent: (data) => api.post('/ai/agent/chat', data),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/mark-all-read'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getDatabaseStats: () => api.get('/admin/database-stats'),
  getStudents: (params) => api.get('/admin/students', { params }),
  getStudentDetails: (id) => api.get(`/admin/students/${id}`),
  createSkill: (data) => api.post('/admin/skills', data),
  createAssessment: (data) => api.post('/admin/assessments', data),
  getQuestions: () => api.get('/admin/questions'),
  createQuestion: (data) => api.post('/admin/questions', data),
  createCompany: (data) => api.post('/admin/companies', data),
  createDrive: (data) => api.post('/admin/drives', data),
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  updateApplicationStatus: (id, data) => api.patch(`/admin/applications/${id}/status`, data),
};
