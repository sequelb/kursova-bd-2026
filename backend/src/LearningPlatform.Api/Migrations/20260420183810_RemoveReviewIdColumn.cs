using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LearningPlatform.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveReviewIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_reviews",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "ix_reviews_enrollment_id",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "id",
                table: "reviews");

            migrationBuilder.AddPrimaryKey(
                name: "pk_reviews",
                table: "reviews",
                column: "enrollment_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_reviews",
                table: "reviews");

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "pk_reviews",
                table: "reviews",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "ix_reviews_enrollment_id",
                table: "reviews",
                column: "enrollment_id",
                unique: true);
        }
    }
}
