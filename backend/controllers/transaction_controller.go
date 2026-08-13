package controllers

import (
	"net/http"

	"test-case-backend/config"
	"test-case-backend/models"

	"github.com/gin-gonic/gin"
)

type TransactionInput struct {
	CustomerNumber string  `json:"customer_number" binding:"required"`
	CustomerName   string  `json:"customer_name" binding:"required"`
	Amount         float64 `json:"amount" binding:"required,gt=0"`
	PaymentMethod  string  `json:"payment_method" binding:"required"`
	Status         string  `json:"status" binding:"required,oneof=Pending Success Failed"`
}

func GetTransactions(c *gin.Context) {
	var transactions []models.Transaction
	config.DB.Order("updated_at desc").Find(&transactions)

	c.JSON(http.StatusOK, gin.H{"data": transactions})
}

func GetTransaction(c *gin.Context) {
	id := c.Param("id")
	var transaction models.Transaction

	if err := config.DB.First(&transaction, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": transaction})
}

func CreateTransaction(c *gin.Context) {
	var input TransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transaction := models.Transaction{
		CustomerNumber: input.CustomerNumber,
		CustomerName:   input.CustomerName,
		Amount:         input.Amount,
		PaymentMethod:  input.PaymentMethod,
		Status:         input.Status,
	}

	if err := config.DB.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": transaction})
}

func UpdateTransaction(c *gin.Context) {
	id := c.Param("id")
	var transaction models.Transaction

	if err := config.DB.First(&transaction, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	var input TransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Model(&transaction).Updates(models.Transaction{
		CustomerNumber: input.CustomerNumber,
		CustomerName:   input.CustomerName,
		Amount:         input.Amount,
		PaymentMethod:  input.PaymentMethod,
		Status:         input.Status,
	})

	c.JSON(http.StatusOK, gin.H{"data": transaction})
}

func DeleteTransaction(c *gin.Context) {
	id := c.Param("id")
	var transaction models.Transaction

	if err := config.DB.First(&transaction, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	config.DB.Delete(&transaction)
	c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted"})
}
