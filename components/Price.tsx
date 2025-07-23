import { formatDZD } from "@/lib/actions/actions"

type PriceProps = {
    price: number,
    solde: boolean,
    newprice?: number
}



export const Price = ({ price, solde, newprice }: PriceProps) => {

    return (
        <div >



            {solde && newprice ?
                <>
                    <div className="flex flex-row">
                        <p className=" line-through">{formatDZD(price)}</p>

                        <p className="text-red-600 mr-6 ">-{Math.round(((price - newprice) / price) * 100)} %</p>

                    </div>
                    <div className="flex flex-row">
                        <p className="text-body-bold">{formatDZD(newprice)}</p>

                    </div>

                </>
                : <p className="text-body-bold">{formatDZD(price)}</p>
            }

        </div>



    )



}