namespace LearningPlatform.Api.Dtos;

public record RegisterRequest(string Email, string Password, string FirstName, string LastName, string Role);
public record LoginRequest(string Email, string Password);
public record UserResponse(int Id, string Email, string FirstName, string LastName, string Role);
