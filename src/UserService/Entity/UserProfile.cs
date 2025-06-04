using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

public class UserProfile
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public string UserId { get; set; }

    [BsonElement("username")]
    public string UserName { get; set; }

    [BsonElement("fullName")]
    public string FullName { get; set; }

    [BsonElement("address")]
    public string Address { get; set; }

    [BsonElement("idCardNumber")]
    public string IdCardNumber { get; set; }

    [BsonElement("idCardImageUrl")]
    public string IdCardImageUrl { get; set; }

    [BsonElement("bankAccount")]
    public string BankAccount { get; set; }

    [BsonElement("isSeller")]
    public bool IsSeller { get; set; } = false;

    [BsonElement("verificationStatus")]
    public string VerificationStatus { get; set; } = "pending";

    [BsonElement("rejectionReason")]
    public string RejectionReason { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("role")]
    public string Role { get; set; } = "user";
    public List<Rating> Ratings { get; set; } = new();

    [BsonElement("averageRating")]
    public double AverageRating { get; set; } = 0.0;
}
public class Rating
{
    public string ReviewerId { get; set; }
    public string Comment { get; set; }
    public int Stars { get; set; } // Từ 1 đến 5
    public DateTime RatedAt { get; set; }
}

