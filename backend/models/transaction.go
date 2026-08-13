package models

import (
	"time"
)

type Transaction struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	CustomerNumber string    `gorm:"type:varchar(50);not null" json:"customer_number"`
	CustomerName   string    `gorm:"type:varchar(100);not null" json:"customer_name"`
	Amount         float64   `gorm:"type:decimal(15,2);not null" json:"amount"`
	PaymentMethod  string    `gorm:"type:varchar(50);not null" json:"payment_method"`
	Status         string    `gorm:"type:varchar(20);not null;default:'Pending'" json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
