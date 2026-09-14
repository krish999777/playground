package src;
import java.sql.*;
class Main{
    public static void main(String args[]){
        try(
            Connection connection = DriverManager.getConnection(
            "jdbc:postgresql://localhost:5432/jdbc_learning",
            "krishshah",
            args[0]
            );
            PreparedStatement statement = connection.prepareStatement("INSERT INTO students (name,roll_no) VALUES (?,?)");
        ){
            statement.setString(1,"Kush");
            statement.setInt(2,13);
            statement.executeUpdate();
        }catch(SQLException e){
            System.out.println("SQL error");
            e.printStackTrace();
        }catch(Exception e){
            System.out.println("Unknown error");
            System.out.println(e);
        }
    }
}