public class DSA {
    public static void main(String args[]){
        Generic<String> g=new Generic<>("hi");
        String s=(String)g.get();
        System.out.println(s);
    }
}
class Generic<T>{
    T obj;
    String p;
    Generic(T o){
        obj=o;
    }
    T get(){
        return obj;
    }
}
