namespace LearningPlatform.DataLoader;

/// <summary>
/// Random first/last name combinations + email generation. Used to fabricate
/// believable teacher and student accounts since the Udemy CSV doesn't ship
/// with real instructor or student names.
/// </summary>
internal static class NamePool
{
    private static readonly string[] FirstNames =
    {
        "Alex", "Maria", "John", "Olena", "Daniel", "Anna", "Mark", "Sofia",
        "Liam", "Emma", "Noah", "Olivia", "Oliver", "Ava", "Elijah", "Mia",
        "James", "Charlotte", "Lucas", "Amelia", "Henry", "Harper", "Mason", "Evelyn",
        "Ethan", "Abigail", "Logan", "Emily", "Jacob", "Elizabeth", "Jack", "Sofia",
        "Michael", "Avery", "Daniel", "Ella", "Jackson", "Scarlett", "Sebastian", "Grace",
        "Aiden", "Chloe", "Owen", "Victoria", "Samuel", "Riley", "Matthew", "Aria",
        "David", "Lily", "Joseph", "Aubrey", "Carter", "Zoey", "Wyatt", "Hannah",
        "Luke", "Lillian", "Jayden", "Addison", "Dylan", "Eleanor", "Grayson", "Natalie",
        "Levi", "Luna", "Isaac", "Savannah", "Gabriel", "Brooklyn", "Julian", "Leah",
        "Anthony", "Zoe", "Lincoln", "Stella", "Joshua", "Hazel", "Christopher", "Ellie",
        "Andrew", "Paisley", "Theodore", "Audrey", "Caleb", "Skylar", "Ryan", "Violet",
        "Asher", "Claire", "Nathan", "Bella", "Thomas", "Aurora", "Leo", "Lucy",
        "Isaiah", "Anna", "Charles", "Samantha", "Josiah", "Caroline", "Hudson", "Genesis",
    };

    private static readonly string[] LastNames =
    {
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
        "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
        "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
        "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
        "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
        "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz",
        "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales",
        "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson",
        "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward",
        "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray",
        "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel",
        "Myers", "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry",
    };

    public static (string First, string Last) Random(Random rng) =>
        (FirstNames[rng.Next(FirstNames.Length)], LastNames[rng.Next(LastNames.Length)]);

    public static string EmailFor(string first, string last, int seq) =>
        $"{first.ToLowerInvariant()}.{last.ToLowerInvariant()}{seq}@local.example";
}
