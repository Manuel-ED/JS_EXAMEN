@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExamenController {

    @Autowired private ProductoRepository prodRepo;
    @Autowired private PedidoRepository pedidoRepo;

    @GetMapping("/productos")
    public List<Producto> listarProds() { return prodRepo.findAll(); }

    @GetMapping("/productos/{id}")
    public Producto obtenerUno(@PathVariable Long id) { 
        return prodRepo.findById(id).orElse(null); 
    }

    @PostMapping("/pedidos")
    public Pedido guardarPedido(@RequestBody Pedido pedido) { 
        return pedidoRepo.save(pedido); 
    }
}