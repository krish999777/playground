import java.util.*;
public class DSA {
    public static void main(String args[]){
        Set<Integer> s=new HashSet<>();
        s.add(1);
        s.add(2);
        s.add(3);
        s.add(2);
        System.out.println(s.contains(2));
        System.out.println(s.contains(4));
        for(int a:s){
            System.out.println(a);
        }
    }
}
