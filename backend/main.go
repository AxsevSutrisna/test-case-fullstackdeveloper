package main

import (
	"log"

	"test-case-backend/config"
	"test-case-backend/controllers"
	"test-case-backend/middlewares"
	"test-case-backend/models"
	"test-case-backend/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to Database
	config.ConnectDatabase()

	// Auto Migrate
	err := config.DB.AutoMigrate(&models.User{}, &models.Transaction{})
	if err != nil {
		log.Fatal("Failed to auto-migrate models: ", err)
	}

	// Seed Data
	seedData()

	// Initialize Gin router
	r := gin.Default()

	// Very simple CORS middleware for local development
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Public Routes
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// Protected Routes
		protected := api.Group("/transactions")
		protected.Use(middlewares.AuthMiddleware())
		{
			protected.GET("", controllers.GetTransactions)
			protected.GET("/:id", controllers.GetTransaction)
			protected.POST("", controllers.CreateTransaction)
			protected.PUT("/:id", controllers.UpdateTransaction)
			protected.DELETE("/:id", controllers.DeleteTransaction)
		}
	}

	log.Println("Server running on http://localhost:8080")
	r.Run(":8080")
}

func seedData() {
	var count int64
	config.DB.Model(&models.User{}).Count(&count)
	if count == 0 {
		hashed, _ := utils.HashPassword("password123")
		admin := models.User{
			Name:         "Admin Tester",
			Email:        "admin@test.com",
			PasswordHash: hashed,
		}
		config.DB.Create(&admin)
		log.Println("Seeded User: admin@test.com / password123")
	}

	config.DB.Model(&models.Transaction{}).Count(&count)
	if count == 0 {
		txs := []models.Transaction{
			{CustomerNumber: "CUST-001", CustomerName: "Budi Santoso", Amount: 150000, PaymentMethod: "Transfer Bank", Status: "Success"},
			{CustomerNumber: "CUST-002", CustomerName: "Siti Aminah", Amount: 50000, PaymentMethod: "E-Wallet", Status: "Pending"},
		}
		for _, tx := range txs {
			config.DB.Create(&tx)
		}
		log.Println("Seeded Transactions")
	}
}
