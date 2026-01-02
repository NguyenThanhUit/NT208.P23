using MongoDB.Driver;

public class UserProfileContext : IUserProfileContext
{
    public IMongoCollection<UserProfile> UserProfiles { get; }

    public UserProfileContext(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("UserDbConnection"));
        var database = client.GetDatabase("UserDb");
        UserProfiles = database.GetCollection<UserProfile>("UserProfiles");
    }
}
