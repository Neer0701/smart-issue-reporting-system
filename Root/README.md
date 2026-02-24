->Project Overview

Smart Issue Reporting System is a full stack web application that allows users to report issues, track their status, and enable administrators to manage and resolve them efficiently.

The system focuses on structured complaint handling, real time tracking, and transparent resolution workflow.

->Problem Statement

Manual complaint systems suffer from:

• Lack of tracking transparency
• No centralized data storage
• Delayed resolution
• Poor communication between users and authorities

This system digitizes the workflow and stores structured issue data in a centralized database.

->Features

User Module

• User registration and login
• Submit new issue with category and description
• View personal submitted issues
• Track issue status

Admin Module

• View all submitted issues
• Update issue status
• Manage user records
• Dashboard based overview

System Features

• RESTful API architecture
• CRUD operations
• Role based access
• Structured database design
• Secure authentication

->Tech Stack

Frontend
• HTML
• CSS
• JavaScript

Backend
• Node.js
• Express.js

Database
• MongoDB

Tools
• Postman for API testing
• Ngrok for temporary public access

->System Architecture

Client sends HTTP request
Backend Express server processes request
MongoDB stores and retrieves issue data
Response returned in JSON format

Architecture Type
• Three tier architecture
• Client layer
• Application layer
• Database layer

->Database Design

Collections Used

Users
• userId
• name
• email
• password
• role

Issues
• issueId
• title
• description
• category
• status
• createdAt
• userId