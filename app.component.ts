import { Component ,  OnInit, ViewChild , ElementRef , OnDestroy  } from '@angular/core';
import {fromEvent, Observable , Subject, Subscription} from 'rxjs';
import {filter, map , switchMap, tap  , debounceTime , shareReplay, multicast} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy {
  
  @ViewChild('search' , {static : true}) 
  search?: ElementRef<HTMLInputElement>

  users : any = []
  typeAheadSub?:Subscription

  ngOnInit(){

    // TypeAhead
   const searchObs = fromEvent(this.search!.nativeElement , "input")
                    .pipe(
                      debounceTime(1000),
                      filter((e : any)=>e.target.value != " "),
                      switchMap((e : any)=> {
                     return fetch(`http://api.github.com/search/users?q=${e.target.value}`).then((response) => response.json()).then((res) => console.log({res}),
                     )
                    }),
                   
                    )
   this.typeAheadSub = searchObs.subscribe((value : any)=>{
    console.log(value)
    this.users = value
   })


   const subject = new Subject<string>()



    //observable --> who emits the data
    const pizzaObservable = new Observable((subscriber)=>{
      console.log("inside obserable")
      subscriber.next({name : "Farm House" , veg : true , size : "small"})
      // subscriber.next({name : "Margherita" , veg : true , size : "large"})
      // subscriber.next({name : "Barbecue Chicken" , veg : false  , size : "mid"})
      subscriber.complete()
    }).pipe(

      tap((pizza: any)=>{ // it is used for debugging and you can perform side effect function
          console.log("pipe")
        // if(pizza.size == "large"){
        //   throw new Error("large size pizzass is overrated")
        // }
      }),
      filter((pizza : any)=>pizza.veg == true ), // filter the value from the pizza
       map((pizza : any) =>  pizza.name), // it filter what we actually we need
       shareReplay()
      // multicast(subject)
       )

    // subscriber / observer => who consumes the emited data
    pizzaObservable.subscribe(
      (value)=> console.log(value), // they represent actual data being delivered to a subscriber 
      (err)=>console.log(err.message),// Errors are an unfortunate side-effect of development.
      ()=>console.log("I am done eating pizzzaaas") // if completed we will get the completed message
    )

      pizzaObservable.subscribe(
      (value)=> console.log(value), // they represent actual data being delivered to a subscriber 
      (err)=>console.log(err.message),// Errors are an unfortunate side-effect of development.
      ()=>console.log("I am done eating pizzzaaas") // if completed we will get the completed message
    )

    // pizzaObservable.connect
       
        // subject.subscribe((value)=>{
        //   console.log("value 1" , value)
        // })
        // subject.subscribe((value)=>{
        //   console.log("value 2" , value)
        // })

        // subject.next(1)
        // subject.next(2)

  }

  ngOnDestroy(){ // clean up code
    if(this.typeAheadSub){
      this.typeAheadSub.unsubscribe()
    }
  }

}
