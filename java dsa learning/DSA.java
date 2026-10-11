import java.util.*;
public class DSA {
    public static void main(String args[]){
        Map<String,Integer> m=new HashMap<>();
        m.put("Krish",1);
        m.put("Chirag",2);
        m.put("Alpa",3);
        m.put("Krish",4);
        System.out.println(m.get("Krish"));
        System.out.println(m.get("Chirag"));
        System.out.println(m.get("Check"));
        System.out.println(m.getOrDefault("Check",0));
        System.out.println(m.containsKey("Krish"));
        System.out.println(m.containsValue(1));
        System.out.println(m.containsValue(4));
        for(Map.Entry<String,Integer> entry:m.entrySet()){
            System.out.println("Key:"+entry.getKey()+" Value="+entry.getValue());
        }

    }
}
