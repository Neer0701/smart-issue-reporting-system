import "./App.css"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"


import { Bar } from "react-chartjs-2"
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
)

function App() {
const navigate = useNavigate()

const [token, setToken] = useState(localStorage.getItem("token"))

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [name, setName] = useState("")
const [category, setCategory] = useState("infrastructure")
const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [issues, setIssues] = useState([])
const [analytics, setAnalytics] = useState(null)

let role = null

if (token) {
try {
const decoded = JSON.parse(atob(token.split(".")[1]))
role = decoded.role
} catch {}
}

const login = async (navigate) => {
try {
const res = await axios.post(
"${import.meta.env.VITE_API_URL}/api/auth/login",
{ email, password }
)
localStorage.setItem("token", res.data.token)
setToken(res.data.token)
navigate("/dashboard")
} catch {
alert("Login failed")
}
}

const signup = async (navigate) => {
try {
const res = await axios.post(
"http://localhost:5000/api/auth/register",
{ name, email, password }
)
localStorage.setItem("token", res.data.token)
setToken(res.data.token)
navigate("/dashboard")
} catch {
alert("Signup failed")
}
}

const logout = () => {
localStorage.removeItem("token")
setToken(null)
setEmail("")
setPassword("")
setName("")
navigate("/")
}

const fetchIssues = async () => {
if (!token) return
const res = await axios.get(
"http://localhost:5000/api/issues",
{ headers: { Authorization: `Bearer ${token}` } }
)
setIssues(res.data)
}

const submitIssue = async () => {
await axios.post(
"http://localhost:5000/api/issues",
{
title,
description,
category,
location: "Main Area"
},
{ headers: { Authorization: `Bearer ${token}` } }
)
setTitle("")
setDescription("")
fetchIssues()
}

const updateStatus = async (id, status) => {
await axios.put(
`http://localhost:5000/api/issues/${id}/status`,
{ status },
{ headers: { Authorization: `Bearer ${token}` } }
)
fetchIssues()
}

const updatePriority = async (id, priority) => {
await axios.put(
`http://localhost:5000/api/issues/${id}/priority`,
{ priority },
{ headers: { Authorization: `Bearer ${token}` } }
)
fetchIssues()
}

const fetchAnalytics = async () => {
const res = await axios.get(
"http://localhost:5000/api/admin/analytics",
{ headers: { Authorization: `Bearer ${token}` } }
)
setAnalytics(res.data)
}

useEffect(() => {
if (token) {
fetchIssues()
}
}, [token])


return (
<Routes>

<Route path="/" element={<Landing />} />

<Route path="/login" element={
  token ? <Navigate to="/dashboard" /> :
  <Login email={email} password={password}
    setEmail={setEmail}
    setPassword={setPassword}
    login={login}
  />
} />

<Route path="/signup" element={
  token ? <Navigate to="/dashboard" /> :
  <Signup
    name={name}
    email={email}
    password={password}
    setName={setName}
    setEmail={setEmail}
    setPassword={setPassword}
    signup={signup}
  />
} />

<Route path="/dashboard" element={
token ?
<Dashboard
role={role}
issues={issues}
title={title}
description={description}
category={category}
setCategory={setCategory}
setTitle={setTitle}
setDescription={setDescription}
submitIssue={submitIssue}
updateStatus={updateStatus}
updatePriority={updatePriority}
logout={(navigate) => logout(navigate)}
fetchAnalytics={fetchAnalytics}
analytics={analytics}
/>
:
<Navigate to="/login" />
} />

</Routes> )

}

function Dashboard({role, issues, title, 
description, category, setCategory, setTitle, 
setDescription,submitIssue, updateStatus, 
updatePriority, logout, fetchAnalytics,analytics}) 
{

const [search, setSearch] = useState("")
const [filterStatus, setFilterStatus] = useState("all")
const navigate = useNavigate()

const filteredIssues = issues.filter(issue => {
const matchesSearch =
issue.title.toLowerCase().includes(search.toLowerCase())

const matchesStatus =
  filterStatus === "all" || issue.status === filterStatus

return matchesSearch && matchesStatus


})

return (
  <div className="dashboard">
    <div className="sidebar">
      <h2>CivicFlow</h2>
    </div>
    <div className="main">
      <div className="top-bar">
        <h1>Issue Management</h1>
        <div className="top-actions">
          <span className="panel-badge">
            {role === "admin" ? "Admin Panel" : "User Panel"}
          </span>
          <button className="logout-btn" onClick={() => logout(navigate)}>
            Logout
          </button>
        </div>
      </div>
      <div className="main">
        <div className="report-card">
          <h3>Report New Issue</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Issue Description"
          />

          <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select">

              <option value="infrastructure">Infrastructure</option> 
              <option value="sanitation">Sanitation</option> 
              <option value="electricity">Electricity</option> 
              <option value="water">Water Supply</option> 
              <option value="traffic">Traffic</option> 
              <option value="public_safety">Public Safety</option> 
              <option value="environment">Environment</option> 
              <option value="others">Others</option> </select>

          <button className="primary-btn" onClick={submitIssue}>
            Submit Issue
          </button>
        </div>
        {role === "admin" && (
          <div className="analytics-card">
            <h3>System Analytics</h3>
            <button onClick={fetchAnalytics}>
              Load Analytics
            </button>
            {analytics && (
              <Bar
                data={{
                  labels: ["Submitted", "In Progress", "Resolved"],
                  datasets: [
                    {
                      label: "Issues",
                      data: [
                        analytics.submitted,
                        analytics.inProgress,
                        analytics.resolved
                      ],
                      backgroundColor: [
                        "#f59e0b",
                        "#3b82f6",
                        "#10b981"
                      ]
                    }
                  ]
                }}
              />
            )}
          </div>
        )}
        <div className="issues-section">
          <h3>All Issues</h3>
          <div className="filter-bar">
            <input
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="submitted">Submitted</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="issues-grid">
            {filteredIssues.map(issue => (
              <div key={issue._id} className="issue-card">
                <div className="issue-header">
                  <h4>{issue.title}</h4>
                  <span className={`status ${issue.status}`}>
                    {issue.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <p>{issue.description}</p>
                <span className={`priority ${issue.priority}`}>
                  {issue.priority.toUpperCase()}
                </span>
                <span className="category-badge"> {issue.category ? issue.category.toUpperCase() : "GENERAL"} </span>

                {role === "admin" && (
                  <div className="admin-controls">
                    <div className="control-group">
                      <p>Set Priority</p>
                      <button
                        className="priority-low"
                        onClick={() => updatePriority(issue._id, "low")}
                      >
                        Low
                      </button>
                      <button
                        className="priority-medium"
                        onClick={() => updatePriority(issue._id, "medium")}
                      >
                        Medium
                      </button>
                      <button
                        className="priority-high"
                        onClick={() => updatePriority(issue._id, "high")}
                      >
                        High
                      </button>
                    </div>
                    <div className="control-group">
                      <p>Update Status</p>
                      <button
                        className="status-submitted"
                        onClick={() => updateStatus(issue._id, "submitted")}
                      >
                        Submitted
                      </button>
                      <button
                        className="status-progress"
                        onClick={() => updateStatus(issue._id, "in_progress")}
                      >
                        In Progress
                      </button>
                      <button
                        className="status-resolved"
                        onClick={() => updateStatus(issue._id, "resolved")}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

function Landing() {
const navigate = useNavigate()
return (
<div className="landing">

  <nav className="navbar">
    <div className="logo-wrapper">
      <div className="logo-icon">!</div>
      <div className="logo-text">CivicFlow</div>
    </div>

    <div className="nav-actions">
      <button
        className="nav-login"
        onClick={() => navigate("/login")}
      >
        Sign In
      </button>

      <button
        className="nav-primary"
        onClick={() => navigate("/signup")}
      >
        Get Started
      </button>
    </div>
  </nav>

  <section className="hero">
    <h1>
      Report. Track. Resolve.
    </h1>

    <h2>
      Your City Issues.
    </h2>

    <p>
      A transparent platform connecting citizens with city authorities.
      Report infrastructure issues, track their resolution status,
      and help build a better community.
    </p>

    <div className="hero-buttons">
      <button
        className="primary-btn"
        onClick={() => navigate("/signup")}
      >
        Start Reporting Issues
      </button>

      <button
        className="secondary-btn"
        onClick={() => navigate("/login")}
      >
        Sign In
      </button>
    </div>
  </section>

  <section className="how-it-works">
    <h2>How It Works</h2>
    <p className="subtitle">
      Simple, transparent, and effective issue resolution
    </p>

    <div className="cards">

      <div className="card-box">
        <div className="icon red">!</div>
        <h3>Report Issues</h3>
        <p>
          Easily report civic issues like potholes,
          streetlights, sanitation problems with
          photos and location details.
        </p>
      </div>

      <div className="card-box">
        <div className="icon yellow">⏱</div>
        <h3>Track Progress</h3>
        <p>
          Monitor the status of your reported issues
          in real time with transparent updates from authorities.
        </p>
      </div>

      <div className="card-box">
        <div className="icon green">✔</div>
        <h3>Get Resolved</h3>
        <p>
          Receive notifications when issues are resolved
          and contribute to a more responsive community.
        </p>
      </div>

    </div>
  </section>

</div>


)
}

function Login({ email, password, setEmail,
setPassword,login}) {

const navigate = useNavigate()

const handleSubmit = (e) => {
e.preventDefault()
login(navigate)
}

return (
<div className="auth-wrapper">
<div className="auth-card">

    <h2>Welcome Back</h2>
    <p className="auth-subtitle">
      Sign in to manage your civic reports
    </p>

    <form onSubmit={handleSubmit}>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="auth-button">
        Sign In
      </button>

    </form>

    <div
      className="auth-footer"
      onClick={() => navigate("/signup")}
    >
      Don’t have an account? Sign Up
    </div>

  </div>
</div>

)
}

function Signup({name, email, password,
setName, setEmail, setPassword,
signup }) {

const navigate = useNavigate()

const handleSubmit = (e) => {
e.preventDefault()
signup(navigate)
}

return (
<div className="auth-wrapper">
<div className="auth-card">

    <h2>Create Account</h2>
    <p className="auth-subtitle">
      Create your account to start reporting issues
    </p>

    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="auth-button">
        Create Account
      </button>

    </form>

    <div
      className="auth-footer"
      onClick={() => navigate("/login")}
    >
      Already have an account? Sign In
    </div>

  </div>
</div>


)
}

export default App