package api

import (
	"net/http"

	"github.com/Allenxuxu/mogutouERP/models"
	"github.com/Allenxuxu/mogutouERP/utils/response"
	"github.com/gin-gonic/gin"
)

// Register 用户注册
func Register(c *gin.Context) {
	var data struct {
		Name     string `json:"name" binding:"required"`
		Tel      string `json:"tel" binding:"required"`
		Password string `json:"password" binding:"required"`
		Position string `json:"position" binding:"required"`
	}
	err := c.ShouldBindJSON(&data)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.Error{Error: err.Error()})
		return
	}
	if models.HaveTel(data.Tel) {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.Error{Error: "账号已存在"})
		return
	}

	user := models.User{
		Name:     data.Name,
		Tel:      data.Tel,
		Password: data.Password, // 直接使用明文密码
		Position: data.Position,
	}

	err = models.CreateUser(&user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.Error{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, models.GetUser(user.UserID))
}
